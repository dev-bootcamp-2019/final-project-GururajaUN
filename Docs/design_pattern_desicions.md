
Below Document provides the details on Design Pattern considerations done for the current project. 

## Course Requirement
Below is the course requirement fullfilled in the project smart contracts.
-	Implement a circuit breaker (emergency stop) pattern 
-	What other design patterns have you used / not used? 
-	Why did you choose the patterns that you did? 
-	Why not others? 

## Action and Control

Action and Control is a group of patterns that provide mechanisms 
for typical operational tasks.

_ | STATE MACHINE PATTERN |
--- | :---  | 
**Problem** | An application scenario implicates different behavioural stages and transitions. | 
**Solution** | Apply a state machine to model and represent different behavioural contract stages and their transitions. | 
Used in Contract Code | YES


_ | PULL PAYMENT PATTERN |
--- | :---  | 
**What it is** | When a contract sends funds to another party, the send operation can fail. | 
Used in Contract Code | NO


## Authorization

Authorization is a group of patterns that control access to
smart contract functions and provide basic authorization control,
which simplify the implementation of "user permissions".

_ | OWNERSHIP PATTERN |
--- | :---  | 
**Problem** | By default any party can call a contract method, but it must be ensured that sensitive contract methods can only be executed by the owner of a contract. | 
**Solution** | Store the contract creator’s address as owner of a contract and restrict method execution dependent on the callers address. | 
Used in Contract Code | YES

_ | ACCESS RESTRICTION PATTERN |
--- | :---  | 
**Problem** | By default a contract method is executed without any preconditions being checked, but it is desired that the execution is only allowed if certain requirements are met. | 
**Solution** | Define generally applicable modifiers that check the desired requirements and apply these modifiers in the function definition. | 
Used in Contract Code | YES

## Lifecycle

Lifecycle is a group of patterns that control the creation and
destruction of smart contracts.

_ | MORTAL PATTERN |
--- | :---  | 
**Problem** | A deployed contract will exist as long as the Ethereum network exists. If a contract’s lifetime is over, it must be possible to destroy a contract and stop it from operating. | 
**Solution** | Use a selfdestruct call within a method that does a preliminary authorization check of the invoking party. | 
Used in Contract Code | YES

## Security

Security is a group of patterns that introduce safety measures
to mitigate damage and assure a reliable contract execution.


_ | EMERGENCY STOP (CIRCUIT BREAKER) PATTERN |
--- | :---  | 
**Problem** | Since a deployed contract is executed autonomously on the Ethereum network, there is no option to halt its execution in case of a major bug or security issue. | 
**Solution** | Incorporate an emergency stop functionality into the contract that can be triggered by an authenticated party to disable sensitive functions. | 
Used in Contract Code | YES

