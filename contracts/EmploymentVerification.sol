pragma solidity ^0.4.24;

import './CircuitBreaker.sol';

/** @title Employment Verification Contract. */
contract EmploymentVerification is CircuitBreaker {

    //State variables
    
    address private owner;              // Address of the Owner who deployed the contract
    uint private total_applicants;      // Track the total number of applicants added through the contract.
    address private universityAddress;  // Only this address is allowed to act as university
    address private employerAddress;    // Only this address is allowed to act as Employer
    
    mapping (uint => Applicant) public applicants; // Global structure of store the applicant details.
    
    mapping (address => Registered) public registered;

    enum Status {UnVerified,Rejected,Verified}      // Possible statuses of the applicant's submission.
    
    struct Applicant{
        string name;
        string degreehash;
        string experiencehash;
        address applicant_address;
        uint universityVerificationStatus;
        uint employerVerificationStatus;        
    }

    struct Registered{
        bool enrolled;
        uint index;
    }
    
    // List of all the events emitted by the contract
    event NewApplicantAdded(uint index);
    event UniversityVerfied(uint index);
    event EmployerVerified(uint index);
    event NotifyMalliciousAttempt(address sender);

    //List of all the modifiers that are used in the contract
    modifier onlyNonRegistered(address _sender){ require(registered[_sender].enrolled == false); _; }
    modifier onlyUniversity(){ require(msg.sender == universityAddress ); _; }
    modifier onlyEmployer(){ require(msg.sender == employerAddress ); _; }
    modifier onlyContractDeployer(){ require(msg.sender == owner ); _; }
    modifier onlyValidUser(address _sender){ require((msg.sender == owner) || (msg.sender == universityAddress) || (msg.sender == employerAddress) || (applicants[registered[_sender].index].applicant_address == _sender)); _; }
    modifier onlyIfUnVerifiedByUni(uint _index){ require(applicants[_index].universityVerificationStatus == uint(Status.UnVerified)); _; }
    modifier onlyIfUnVerifiedByEmp(uint _index){ require(applicants[_index].employerVerificationStatus == uint(Status.UnVerified)); _; }

  /** @dev Constructor.Requires the universityAddress and employerAddress to passed.Only These addresses will be allowed to update respective status 
    * @notice Construcor. 
    * @param _universityAddress Name of the applicant.
    * @param _employerAddress IPFS hash of the degree certificate.
    */
    constructor (address _universityAddress, address _employerAddress) public {
    owner = msg.sender; /* Set the owner to the creator of this contract */
    total_applicants = 0;
    universityAddress = _universityAddress;
    employerAddress = _employerAddress;
    }

  /** @dev Adds a new applicant if not already registered.
    * @notice Adds a new applicant.
    * @param _name Name of the applicant.
    * @param _degreehash IPFS hash of the degree certificate.
    * @param _experiencehash IPFS hash of the Employment certificate.
    * @return success of the addition.
    */
    function newApplicant(string _name,string _degreehash, string _experiencehash)
    external
    contractStarted
    onlyNonRegistered(msg.sender)
    returns (bool)
    {
       
        total_applicants = total_applicants + 1;
        applicants[total_applicants].name = _name;
        applicants[total_applicants].degreehash = _degreehash;
        applicants[total_applicants].experiencehash = _experiencehash;
        applicants[total_applicants].universityVerificationStatus = uint(Status.UnVerified);
        applicants[total_applicants].employerVerificationStatus = uint(Status.UnVerified);
        applicants[total_applicants].applicant_address = msg.sender;
        registered[msg.sender].enrolled = true;
        registered[msg.sender].index = total_applicants;

        emit NewApplicantAdded(total_applicants);
        return true;
    }

  /** @notice Returns the total number of applicants added using this contract
    * @return total_applicants
    */
    function getApplicantTotal()
    external
    view
    contractStarted
    onlyValidUser(msg.sender)
    returns(uint){
        return total_applicants;
    }

  /** @notice To know if the user is already registered
    * @return Returns valid index only if the user is already registered, 0 otherwise
    */
    function getMyIndex()
    view
    external
    contractStarted
    returns(uint){
        return registered[msg.sender].index; // Returns 0 for non registered applicants.
    }

  /** @notice To get the index of the user based on his address. Needed to retireve the Applicant information.
    * @return Returns valid index only if the user is already registered, 0 otherwise
    */ 
    function getApplicantIndex(address _applicant)
    view
    external
    contractStarted
    onlyValidUser(msg.sender)
    //onlyEmployer
    returns(uint){
        return registered[_applicant].index; // Returns 0 for non registered applicants.
    }

  /** @dev Retrieves the complete info about a perticular applicant.
    * @notice Retrieves applicant info.
    * @param _index Index to retrieve applicant information.
    * @return enrolled True if the applicant is already registered.
    * @return name Applicants name.
    * @return degreehash IPFS hash of the degree certificate.
    * @return experiencehash IPFS hash of the Employment certificate.
    * @return status Current status of Verification
    * @return applicant_address Address of the applicant
    */
    function getApplicantInfo(uint _index)
    view 
    external
    contractStarted
    onlyValidUser(msg.sender)
    returns (string name,string degreehash,string experiencehash,uint universityVerificationStatus,uint employerVerificationStatus,address applicant_address)
    {    
        name = applicants[_index].name;
        degreehash = applicants[_index].degreehash;
        experiencehash = applicants[_index].experiencehash;
        universityVerificationStatus = applicants[_index].universityVerificationStatus;
        employerVerificationStatus = applicants[_index].employerVerificationStatus;
        applicant_address = applicants[_index].applicant_address;
    }

  /** @notice Function for the university to modify the University Verification.
    * @param _index Index to retrieve applicant information.
    * @param _approvalStatus Rejected / Verified by the University.
    */ 
    function universityVerification(uint _index,uint _approvalStatus)
    external
    contractStarted
    onlyUniversity
    onlyIfUnVerifiedByUni(_index)
    {
    applicants[_index].universityVerificationStatus = _approvalStatus;
    emit UniversityVerfied(_index);
    }

  /** @notice Function for the Employer to modify the Employer Verification for its outgoing employes.
    * @param _index Index to retrieve applicant information.
    * @param _approvalStatus Rejected / Verified by the Employer.
    */     
    function employerVerification(uint _index,uint _approvalStatus)
    external
    contractStarted
    onlyEmployer
    onlyIfUnVerifiedByEmp(_index)
    {
    applicants[_index].employerVerificationStatus = _approvalStatus;
    emit EmployerVerified(_index);
    }

    //Fallback Function.
    //Emits address of the sender. Owner can make a decission based on this info. eg: stopcontract().
    function () payable external {
        emit NotifyMalliciousAttempt(msg.sender);
    }

    // Self destruct. Can be invoked only by the Contract Owner.
    function mortal()
    external
    onlyContractDeployer
    {
        selfdestruct(owner);
    }
}