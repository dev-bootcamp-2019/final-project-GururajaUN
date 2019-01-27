pragma solidity ^0.4.24;

import "zeppelin/ownership/Ownable.sol";

/** @title CircuitBreaker */
contract CircuitBreaker is Ownable {
  enum BreakerStates { Started, Stopped }
  BreakerStates public state;

  constructor ()
    public
  {
    state = BreakerStates.Started;
  }

  /**
  * @dev Only allow function to be executed with Contract is in state "Started"
  */
  modifier contractStarted() {
    require(state == BreakerStates.Started);
    _;
  }

  /**
  * @dev Enables circuit breaker stopping all functionality
  */
  function stopContract()
    external
    onlyOwner
  {
    state = BreakerStates.Stopped;
  }

  /**
  * @dev Disables circuit breaker enabling all functionality
  */
  function startContract()
    external
    onlyOwner
  {
    state = BreakerStates.Started;
  }
}
