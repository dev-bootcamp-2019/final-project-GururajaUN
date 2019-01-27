const EmploymentVerification = artifacts.require("./EmploymentVerification.sol");

contract("EmploymentVerification", function(accounts) {
    
    const owner = accounts[0]
    const applicant = accounts[1]
    const university = accounts[2]
    const employer = accounts[3]
    const hacker = accounts[4]
    const catchRevert = require("./exceptions.js").catchRevert;
    const unVerified = 0;
    const rejected = 1;
    const verified = 2;
    let index = 0;
    
    const applicant_name = "Alice"
    const degree_hash = "0x123"
    const experience_hash = "0x456"


    describe("Actor -> Applicant", function() {
        describe("Positive Test Cases for Applicant", function() {

            it("Should add a new applicant successfully", async() => {
                let eventEmitted = false
                const expected_university_verification = unVerified;
                const expected_employer_verification = unVerified;
                const employmentverification = await EmploymentVerification.deployed()

                const tx = await employmentverification.newApplicant(applicant_name, degree_hash, experience_hash, {from: applicant})

                if (tx.logs[0].event) {
                    index = tx.logs[0].args.index.toString(10)
                    eventEmitted = true
                }

                const result = await employmentverification.getApplicantInfo.call(index)
                
                assert.equal(result[0], applicant_name , 'the name of the added applicant does not match the expected value')
                assert.equal(result[1], degree_hash , 'the degree hash of the last added applicant does not match the expected value')
                assert.equal(result[2], experience_hash , 'the experience hash of the last added applicant does not match the expected value')
                assert.equal(result[3].toString(10), expected_university_verification, 'the university verification status does not match the expected value')
                assert.equal(result[4].toString(10), expected_employer_verification, 'the employer verification status does not match the expected value')
                assert.equal(result[5], applicant, 'the applicant address returned doesnt match')        
                assert.equal(eventEmitted, true, 'adding a Applicant should emit an event')
            })

            it("Should get the applicant index successfully", async() => {
                const employmentverification = await EmploymentVerification.deployed()
                const expected_index = 1;
                const result = await employmentverification.getMyIndex.call({from: applicant})
                assert.equal(result,expected_index ,'Index doesnt match the expected value')
            });
        });

        describe("Negetive Test Cases for Applicant", function() { 
            it("Contract shouldnt allow adding the same applicant again", async() => {
                const applicant_name = "Alice"
                const degree_hash = "0x123"
                const experience_hash = "0x456"

                const employmentverification = await EmploymentVerification.deployed()
                await catchRevert(employmentverification.newApplicant(applicant_name, degree_hash, experience_hash, {from: applicant}));
            });
        });
    });

    describe("Actor -> University", function() {
        describe("Positive Test Cases for University", function() {
            it("Allow the university to update the application status ", async() => {

                const employmentverification = await EmploymentVerification.deployed()

                let eventEmitted = false
                const expected_university_verification = rejected
                const expected_employer_verification = unVerified
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                const tx = await employmentverification.universityVerification(applicant_index,rejected, {from: university});

                if (tx.logs[0].event) {
                    index = tx.logs[0].args.index.toString(10)
                    eventEmitted = true
                }

                const result = await employmentverification.getApplicantInfo.call(index)

                assert.equal(result[0], applicant_name , 'the name of the last added applicant does not match the expected value')
                assert.equal(result[1], degree_hash , 'the degree hash of the last added applicant does not match the expected value')
                assert.equal(result[2], experience_hash , 'the experience hash of the last added applicant does not match the expected value')
                assert.equal(result[3].toString(10), expected_university_verification, 'the university verification status does not match the expected value')
                assert.equal(result[4].toString(10), expected_employer_verification, 'the employer verification status does not match the expected value')
                assert.equal(result[5], applicant, 'the applicant address returned doesnt match')        
                assert.equal(eventEmitted, true, 'adding a Applicant should emit an event')

            });

        });

        describe("Negetive Test Cases for University", function() {
            it("Do not allow University to change the application status again ", async() => {
                const employmentverification = await EmploymentVerification.deployed() 
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                await catchRevert(employmentverification.universityVerification(applicant_index,rejected, {from: employer}));
            });
            
            it("Disallow update request from anyone other than university ", async() => {
                const employmentverification = await EmploymentVerification.deployed() 
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                await catchRevert(employmentverification.universityVerification(applicant_index,verified, {from: hacker}));
            });

        });
    });

    describe("Actor -> Employer", function() {
        describe("Positive Test Cases for Employer", function() {
            it("Allow employer to verify the applicant status ", async() => {

                const employmentverification = await EmploymentVerification.deployed()

                let eventEmitted = false
                const expected_university_verification = rejected
                const expected_employer_verification = verified
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                const tx = await employmentverification.employerVerification(applicant_index,verified, {from: employer});

                if (tx.logs[0].event) {
                    index = tx.logs[0].args.index.toString(10)
                    eventEmitted = true
                }

                const result = await employmentverification.getApplicantInfo.call(index)

                assert.equal(result[0], applicant_name , 'the name of the last added applicant does not match the expected value')
                assert.equal(result[1], degree_hash , 'the degree hash of the last added applicant does not match the expected value')
                assert.equal(result[2], experience_hash , 'the experience hash of the last added applicant does not match the expected value')
                assert.equal(result[3].toString(10), expected_university_verification, 'the university verification status does not match the expected value')
                assert.equal(result[4].toString(10), expected_employer_verification, 'the employer verification status does not match the expected value')
                assert.equal(result[5], applicant, 'the applicant address returned doesnt match')        
                assert.equal(eventEmitted, true, 'adding a Applicant should emit an event')

            });
        });

        describe("Negetive Test Cases for Employer", function() {
            it("Do not allow employer to change the application status again ", async() => {
                const employmentverification = await EmploymentVerification.deployed() 
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                await catchRevert(employmentverification.employerVerification(applicant_index,rejected, {from: employer}));
            });

            it("Disallow update request from anyone other than employer ", async() => {
                const employmentverification = await EmploymentVerification.deployed() 
                const applicant_index = await employmentverification.getMyIndex({from: applicant});
                await catchRevert(employmentverification.universityVerification(applicant_index,verified, {from: hacker}));
            });

        });

    });

    describe("Misc", function() {
        it("Allow only valid users to read the information from contract ", async() => {
            const employmentverification = await EmploymentVerification.deployed() 
            await catchRevert(employmentverification.getApplicantInfo(0,{from: hacker}));
        });
    
    });


});
