import React, { Component } from 'react';
import {
    Grid,
    Paper,
    Button,
    Typography,
    AppBar
} from '@material-ui/core/';

import EmploymentVerificationContract from "../contracts/EmploymentVerification.json";
import getWeb3 from "../utils/getWeb3";

class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            applicantAddress: null,
            web3: null,
            accounts: null,
            contract: null,
        };
    }

    componentDidMount = async () => {
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
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.${error}`,
            );
            console.error(error);
        }
    };



    onApplicantClick = async () => {
        console.log('Applicant Clicked');
        const { accounts, contract } = this.state;

        try {
            const index = await contract.methods.getMyIndex().call({ from: accounts[0] });
            console.log(`recieved from smart contract ${index}`);
            if (index === '0') {
                this.props.history.push('/ApplicantAddition');
            }
            else {
                this.props.history.push('/UserTableList');
            }
        }
        catch (error) {
            alert(
                `${error}`,
            );
        }
    }
    onUniversityClick = () => {
        console.log('university click');
        this.props.history.push('/UniversityVerification');
    }
    onEmployerClick = () => {
        console.log('Employer clicked');
        this.props.history.push('/EmployerScreen');
    }

    render() {
        return (

            <div style={{ flexGrow: 1 }}>
                <AppBar position="fixed" style={{ height: '80px' }}>
                    <Typography variant="h6" color="inherit" style={{ padding: '20px', alignSelf: 'center' }} >
                        Pre-employment Verification
                                </Typography>
                    <Typography color="inherit" style={{ top: '25px',position:'absolute' , alignSelf: 'flex-end', fontSize:'15px' , paddingRight:'25px' }} >
                        Hi {this.state.accounts && this.state.accounts.length !== 0 && this.state.accounts[0]}
                                </Typography>
                </AppBar>absolute
                <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: '100vh', backgroundColor: "#F2F2F2" }}>
                    <Paper style={{ width: '50%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} elevation={1} >
                        <div style={{ marginLeft: '40%' }}>
                            <Typography variant="h4" gutterBottom color='primary' justify='center' style={{ paddingLeft: '0%' }}>
                                Select Your Role
                                </Typography>
                            <Grid item sm={12} justify='center' alignItems='center'>
                                <Button variant="contained" color="primary" style={classes.buttonstyle} onClick={this.onApplicantClick}>
                                    Applicant
                                    </Button>
                            </Grid>
                            <Grid item sm={12}>
                                <Button variant="contained" color="primary" style={classes.buttonstyle} onClick={this.onUniversityClick}>
                                    University
                                    </Button>
                            </Grid>
                            <Grid item sm={12}>
                                <Button variant="contained" color="primary" style={classes.buttonstyle} onClick={this.onEmployerClick}>
                                    Employer
                                    </Button>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

const classes = {
    buttonstyle: {
        minWidth: 120,
        padding: 10,
        margin: 20
    }
}
export default HomePage;