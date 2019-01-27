import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import {
  Grid,
  Paper,
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
  {
    Header: 'Employer',
    accessor: 'Employer',
    //minWidth: 230,
    // filterable: false,
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500,
      textTransform: 'capitalize'
    },
    style: { cursor: 'pointer', fontSize: 15, textTransform: 'capitalize' }
  },
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
  {
    Header: 'Employer Status',
    accessor: 'EmployerStatus',
    headerStyle: {
      backgroundColor: '#4054AF',
      color: 'white',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 500
    },
    style: { fontSize: 15 },
    Cell: row => {
      return (
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
      );
    }
  },
]


class UserTableList extends Component {
  onSelectTable = (id) => {
    if (id) {
      id = `https://ipfs.infura.io/ipfs/${id}`;
      console.log("userTableListid", id);
      window.open(id, "_blank");
    }

    // this.props.onSelect(id);
  };

  onSelectTable2 = (id) => {
    if (id) {
      id = `https://ipfs.infura.io/ipfs/${id}`;
      console.log("userTableListid", id);
      window.open(id, "_blank");
    }
  }

  constructor() {
    super();
    this.state = {
      applicantAddress: null,
      web3: null,
      accounts: null,
      contract: null,
      userInfoRecieved: false,
      data: []
    };
  }



  componentWillMount = async () => {
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

      const index = await instance.methods.getMyIndex().call({ from: accounts[0] });
      console.log('5');
      console.log(`recieved from smart contract ${index}`);
      const info = await instance.methods.getApplicantInfo(index).call({ from: accounts[0] });
      console.log('6');
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
            "EmployerStatus": EmployerStatus,
          }]
        });
        console.log(`Data Array : ${this.state.data.length}`)
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
    return (
      <div>
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
                  defaultPageSize={3}
                  // pageSizeOptions = {[5,10]}
                  sortable
                  //filterable
                  //resizable={false}
                  style={{
                    height: "200px",
                  }}

                  className="-striped -highlight"
                  getTrProps={
                    (state, rowInfo, select) => {
                      if (rowInfo && rowInfo.row["Degree"]) {
                        return {
                          onClick: (id) => {
                            this.onSelectTable(rowInfo.row["Degree"]);
                          },
                        }
                      } else if (rowInfo && rowInfo.row["Employer"]) {
                        return {
                          onClick: (id) => {
                            this.onSelectTable2(rowInfo.row["Employer"]);
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
          </Paper>
        </Grid>
      </div>
    )
  }

}

export default UserTableList;