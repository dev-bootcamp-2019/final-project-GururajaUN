# final-project-GururajaUN

## Description

This project is a POC for a platform which will enable Pre-Employment Verification ( also known as Background Verification ) via Ethereum BlockChain.

This use case will have 3 actors 
	
	1.	Applicant ( Seeker of the Employment )
			Applicant will submit his Degree Certificate and Previous Employment documents to IPFS using Ethereum account.
	
	2. University 
			University will have a dashboard view of all the applications. University will verify if the Degree Certificate of the applicant are valid and Approve / Reject Applicant's certificate accordingly.
	
	3. Employer
		    As an Employer, 
			    a) One may be validating the Employment certificates of an applicant who is leaving the organization.
			    b) One may be verifying the credetials of the newHire. 


# Scope
-	These use cases are realised using Ethereum accounts provided by Metamask ( as Google Chrome extension ).
-	Front end is developed using ReactJS.
-	All Smart Contracts developed using Solidity.
-	Test Cases are well described and written JavaScript.
-	Whole project is bundled together using Truffle.
-	Project is deployed in Rinkeby Network. Details in Docs/[deployed_addresses.md](https://github.com/dev-bootcamp-2019/final-project-GururajaUN/blob/master/Docs/deployed_addresses.md "deployed_addresses.md")
-	Avoiding Common attack is detailed in Docs/[avoiding_common_attacks.md](https://github.com/dev-bootcamp-2019/final-project-GururajaUN/blob/master/Docs/avoiding_common_attacks.md "avoiding_common_attacks.md")
-	Design Pattern Decisions are detailed in Docs/[design_pattern_desicions.md](https://github.com/dev-bootcamp-2019/final-project-GururajaUN/blob/master/Docs/design_pattern_desicions.md "design_pattern_desicions.md")
-	Library - openzeppelin-solidity ownable is inherited and used in the project.
-	IPFS acts as the Document Storage. Images are stored in IPFS with base64 encoding and can be decoded using https://codebeautify.org/base64-to-image-converter to cross verify. 
	-	Example for IPFS uploaded by the project https://ipfs.infura.io/ipfs/zb2rhknnQnz3ESjzUtqibWg6FfR9Bgot1sQLtEzGxpNNp3o5k
-	Project **Demo video** can be viewed at https://photos.app.goo.gl/L6aX9SJrsrm7PNPx9


## Development setup:

Go to root folder and Install all dependencies for contract development:
```
npm install
```

Install all dependencies for client development:

```
cd client && npm install
```
Launch the Ganache UI (Preferred)
```
-	This is an lightweight application that provides detailed insight about the operations happening on your local blockchain. 
-	This application is available all platforms( Mac/Windows/Linux )
-	Run Ganache on http://127.0.0.1:8545
```
Metamask Setup
```
-	Install Metamask extension to chrome browser.
-	Copy the Mnemonics of Ganache and login in Metamask.
-	Ensure there are multiple accounts imported ( Minimum of 4 accounts ) and visible in Metamask.

```
## Validation

**Smart Contract Validation**
```
truffle test
```
There are 10 tests written for the smart contract covering various Positive & Negative use cases for each of the 3 actors.

Each test is expected to PASS successfully.

**Validation using the React Front End**

```
1. Edit the 2_deploy_contracts.js with correct University & Employer Ethereum address
```
This address is used while deploying the contract to initialise them in the contract. **Only these addresses will be allowed to change the application status during the execution** 
```
2. truffle migrate --reset
3. cd client && npm start
```
```

 1. Application will launch in browser at http://localhost:3000/
 2. Chose your metamask account.
 3. Actor : Applicant
	 -	Select the desired "Role" that you would like to play as "Applicant".
	 -	Make sure the the App displays the desired Ethereum address from Metamask.
	 -	Fill the form and upload the Documents ( only Images are supported at the moment ) into IPFS.
	 -	Once the application is submitted successfully, the dashboard will appear.
4.	Actor University
	-	Select the Appropriate account in metamask ( which was fed into contructor during contract deploy ).
	-	Move to http://localhost:3000/ and refresh the page.
	-	Verify the account number is displayed properly on the screen.
	-	Select the desired "Role" that you would like to play as "University"
	-	You will see the dashboard where you can see all the applicants and their info ( like IPFS hashes ). 
	-	Click anywhere on the row to launch Accept / Reject pop Up.
	-	Once Submitted in Metamask, see that App refreshes dynamically to new status.
	-	University is allowed to modify the state only once per Applicant. 
5.	Actor Employer
	-	Select the Appropriate account in metamask ( which was fed into contructor during contract deploy ).
	-	Move to http://localhost:3000/ and refresh the page.
	-	Verify the account number is displayed properly on the screen.
	-	Select the desired "Role" that you would like to play as "Employer"
	-	You will be given an option either to "Authorise an applicant moving out of the origanization" or verify your New Hire using his/her Ethereum address.
**To Authorise outgoing Employee**
	-	You will see the dashboard where you can see all the applicants and their info ( like IPFS hashes ). 
	-	Click anywhere on the row to launch Accept / Reject pop Up.
	-	Once Submitted in Metamask, see that App refreshes dynamically to new status.
	-	Employer is allowed to modify the state only once per Applicant. 
**To Verify New Hire Employee**
	-	Enter the Ethereum address of the applicant ( Ethereum account which was used to submit the form above )
	-	Once submitted, A dashboard displays current status of the applicant's university and previous employer documents.
```

**Things To Ensure**
- Deploy the contract with correct Ethereum addresses of University and Employer for constructor.	
-	Always ensure the metamask account that you are using to interact is correct. 
-	Start from the http://localhost:3000/ for each Actor.

**Known Issues**
-	Randomly the transactions fail with "Nounce Error" from Metamask.. Resetting Ganache and Metamask account helps to resolve this issue. This issue seems to be due to loosing sync between Blocks and Front End due to unsecure movements using URL's directly.
-	Randomly Metamask stops giving pop-ups for signing the transactions. Such transactions can be signed by directly clicking on Metamask icon in browser.
-	Compilation warnings for Smart Contracts are in "Ownable.sol" which is inherited from Zeppelin.

## Checklist followed for Course Requirement 

 - Run the app on a dev server locally for testing/grading
 - You should be able to visit a URL and interact with the application
	 - App recognizes current account
	 - Sign transactions using MetaMask or uPort
	 - Contract state is updated
	 - Update reflected in UI
-	Test Requirements
	-	Write 5 tests for each contract you wrote
	-	Explain why you wrote those tests
	-	Tests run with truffle test
-	Design Pattern Requirements:
	-	Implement a circuit breaker (emergency stop) pattern
	-	What other design patterns have you used / not used?
		-	Why did you choose the patterns that you did?
		-	Why not others?
-	Security Tools / Common Attacks:
	-	Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
-	Use a library or extend a contract
-	Deploy your application onto one of the test networks.

BONUS
-	Used IPFS
	
