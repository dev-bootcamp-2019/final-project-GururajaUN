# Avoiding Common Attacks
Below document highlights the common attacks that have been addressed in the current project.

## Course Requirement
Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks

_ | Fallback Trap |
--- | :---  | 
**Problem** | Handle the contract being called with undefined function / functions with invalid set of parameters | 
**Solution** | Implemented a fallback function which emits an event. Contract owner can use this even to decide if contract requires an emergency stop. Provision for the owner to do stop / start is provided. | 
Used in Contract Code | YES

_ | Malicious Actors |
--- | :---  | 
**Problem** | The admin users may modify the state variables in unexpected ways| 
**Solution** | Implemented modifiers to verify if the current status variable is UnVerified ( for both University actor / Employer actor ) and thus making sure the corresponding actor can act only once. | 
Used in Contract Code | YES

_ | Emergency Stop / Start |
--- | :---  | 
**Problem** | Contracts are susceptible to attacks| 
**Solution** | Implemented emergency stop / start functionalities which can be called only by the contract deployer. None of the functionalities are accessible when the contract is stopped.| 
Used in Contract Code | YES
