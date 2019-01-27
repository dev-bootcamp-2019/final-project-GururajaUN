import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  AppBar
} from '@material-ui/core/';
import EmploymentVerificationContract from "../contracts/EmploymentVerification.json";
import getWeb3 from "../utils/getWeb3";

const columns = [
  {
    Header: 'Address',
    accessor: 'Address',
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500
    },
    style: { cursor: 'pointer', fontSize: 15 },
    width: 100,
    minWidth: 100,
    maxWidth: 120

  },
  {
    Header: 'Name',
    accessor: 'Name',
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500
    },
    style: { cursor: 'pointer', fontSize: 15 }

  },
  {
    Header: 'Degree',
    accessor: 'Degree',
    //minWidth: 230,
    //filterable: false,
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500
    },
    style: { cursor: 'pointer', fontSize: 15 }
  },
  //   {
  //     Header: 'Employer',
  //     accessor: 'Employer',
  //     //minWidth: 230,
  //    // filterable: false,
  //     headerStyle: {
  //       backgroundColor: '#4054AF',
  //       color: 'white',
  //       textAlign: 'left',
  //       fontSize: 18,
  //       fontWeight: 500,
  //       textTransform: 'capitalize'
  //     },
  //     style: { cursor: 'pointer', fontSize: 15, textTransform: 'capitalize' }
  //   },
  {
    Header: 'University Status',
    accessor: 'UniversityStatus',
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500
    },
    style: { fontSize: 15 },
    Cell: row => (
      <span>
        <span style={{
          color: row.value === '0'
            ? 'orange'
            : row.value === '1'
              ? 'red'
              : row.value === '2'
                ? 'green'
                : null,
          transition: 'all .3s ease'

        }}>

          &#x25C9;
      </span> {
          row.value === '0'
            ? 'UnVerified'
            : row.value === '1'
              ? 'Rejected'
              : row.value === '2'
                ? 'Verified'
                : null
        }
      </span>
    )
  },
]


class UniversityVerification extends Component {
  onSelectTable = (id) => {
    if (id) {

      console.log("userTableListid", id);
      this.setState({
        currentID: id
      });
      this.setState({
        open: true
      })
    }
    console.log("currentid", this.state.currentID);
    // this.props.onSelect(id);
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleReject = () => {
    this.makeContractCall(1);
    this.setState({ open: false });
  };

  handleAccept = () => {
    this.makeContractCall(2);
    this.setState({ open: false });
  };


  constructor() {
    super();
    this.state = {
      applicantAddress: null,
      web3: null,
      accounts: null,
      contract: null,
      userInfoRecieved: false,
      currentID: null,
      open: false,
      data: []
    };
  }

  makeContractCall = async (status) => {
    const { accounts, contract } = this.state;

    try {
      const index = await contract.methods.getApplicantIndex(this.state.currentID).call({ from: accounts[0] });
      console.log(`recieved from smart contract ${index}`);
      if (index === 0) {
        alert(
          `Not a registered user`,
        );
      }
      await contract.methods.universityVerification(index, status).send({ from: accounts[0] });
      setTimeout(() => {
        this.setState({
          data: []
        });
        this.makeTableRequest();
      }, 1000);
    }
    catch (error) {
      // alert(
      //   `Failed Submit. Please check if the address is valid Ethereum address / You are using correct metamask account ${error.message}`,
      // );
      toast.error(`Failed Submit. Please check if you are using correct metamask account ${error.message}`, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }

  }

  componentDidMount() {
    this.makeTableRequest();
  }

  makeTableRequest = async () => {
    console.log('make Contract call');
    try {
      // Get network provider and web3 instance.
      let web3 = window.web3V;

      if (web3 === undefined) {
        web3 = await getWeb3();
        window.web3V = web3;
      }

      console.log('web3 :', web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EmploymentVerificationContract.networks[networkId];

      const instance = new web3.eth.Contract(
        EmploymentVerificationContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state

      this.setState({ web3, accounts, contract: instance });

      const total = await instance.methods.getApplicantTotal().call({ from: accounts[0] });
      console.log(`recieved total from smart contract ${total}`);

      for (let i = 1; i <= total; i++) {
        const info = await instance.methods.getApplicantInfo(i).call({ from: accounts[0] });
        console.log(`recieved from smart contract ${info.name},${info.applicant_address}`);

        if (info) {
          const { applicant_address: Address, name: Name, degreehash: Degree, experiencehash: Employer,
            universityVerificationStatus: UniversityStatus, employerVerificationStatus: EmployerStatus } = info;
          console.log(`Address : ${Address}, us : ${UniversityStatus}, eS: ${EmployerStatus}`);
          this.setState({
            data: [...this.state.data, {
              "Address": Address,
              "Name": Name,
              "Degree": Degree,
              "Employer": Employer,
              "UniversityStatus": UniversityStatus,
              //"EmployerStatus": EmployerStatus,
            }]
          });
        }
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.${error}`,
      );
      console.error(error);
    }
  };

  render() {
    //  this.makeContractCall();
    return (
      <div>
        <ToastContainer />
        <AppBar position="fixed" style={{ height: '80px' }}>
          <Typography variant="h6" color="inherit" style={{ padding: '20px', alignSelf: 'center' }} >
            Pre-employment Verification
                        </Typography>
        </AppBar>
        <Typography color="inherit" style={{ top: '25px', position: 'absolute', alignSelf: 'flex-end', fontSize: '15px', paddingRight: '25px' }} >
          Hi {this.state.accounts && this.state.accounts.length !== 0 && this.state.accounts[0]}
        </Typography>
        <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: '100vh', backgroundColor: "#F2F2F2" }}>
          <Paper style={{ width: '70%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} elevation={1} >
            {
              this.state.data.length !== 0 ? (
                <ReactTable
                  data={this.state.data}
                  columns={columns}
                  defaultPageSize={10}
                  // pageSizeOptions = {[5,10]}
                  sortable
                  //filterable
                  //resizable={false}
                  style={{
                    height: "480px",
                  }}

                  className="-striped -highlight"
                  //showPageJump= {false}
                  getTrProps={
                    (state, rowInfo, select) => {
                      if (rowInfo && rowInfo.row["Address"]) {
                        return {
                          onClick: (id) => {
                            this.onSelectTable(rowInfo.row["Address"]);
                          },
                        }
                      }
                      else {
                        return {}
                      }
                    }
                  }
                />
              ) : null
            }
            {
              this.state.currentID ? (
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Verify the Applicant"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Address => {this.state.currentID}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleReject} color="secondary">
                      Reject
                      </Button>
                    <Button onClick={this.handleAccept} color="primary" autoFocus>
                      Accept
                      </Button>
                  </DialogActions>
                </Dialog>
              ) : (
                  null
                )
            }
          </Paper>
        </Grid>
      </div>
    )
  }

}

const classes = {
  tableContainer: {
    height: 320,
  },
  tableStyle: {
    position: 'relative',
    marginTop: '6%',
    marginLeft: 'auto',
    marginRight: 'auto',
    //display: 'flex',
    //  padding: '2.5%',
    width: '90%',
    //overflow: 'hidden',
    //display: 'flex',
    //backgroundImage: 'url('+ imgSrc +')',
    //backgroundSize: 'cover',
  },
};

export default UniversityVerification;