import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid,
    Paper,
    Button,
    Typography,
    AppBar,
    TextField,
    InputAdornment,
} from '@material-ui/core/';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ReactFileReader from 'react-file-reader';
// First way to import
import { BeatLoader } from 'react-spinners';
import EmploymentVerificationContract from "../contracts/EmploymentVerification.json";
import getWeb3 from "../utils/getWeb3";

const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

class ApplicantAddition extends Component {
    constructor() {
        super();
        this.state = {
            web3: null,
            accounts: null,
            contract: null,
            degreeIPFSHash: null,
            experienceLetterIPFSHash: null,
            ipfsDegLoading: false,
            ipfsExpLoading: false,
            name: null,
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
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    onDegreeupload = async (files) => {
        if (files && files.base64) {
            let pN;
            for (pN in files) {
                console.log(`${pN} : ${files[pN]}`);
            }
            //   console.log(`files : ${{...}}`)
            this.setState({
                ipfsDegLoading: true,
            });
            console.log('Degree upload clicked', files.base64);

            const ipfsHash = await ipfs.add(files.base64);
            console.log('ipfshash :', ipfsHash);
            this.setState({
                degreeIPFSHash: ipfsHash,
                ipfsDegLoading: false,
            });
        }

    }

    onExpUpload = async (files) => {
        if (files && files.base64) {
            console.log('Exp upload clicked', files.base64);
            this.setState({
                ipfsExpLoading: true,
            });
            const ipfsHash = await ipfs.add(files.base64);
            console.log('ipfshash :', ipfsHash);
            this.setState({
                experienceLetterIPFSHash: ipfsHash,
                ipfsExpLoading: false,
            });
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        console.log('name ', this.state.name);
    };

    onSubmitClick = async () => {
        const { accounts, contract } = this.state;

        console.log('Submit clicked');
        console.log(`Name : ${this.state.name}`);
        console.log(`Degree Certificate Hash : ${this.state.degreeIPFSHash}`);
        console.log(`Exp Certificate Hash : ${this.state.experienceLetterIPFSHash}`);

        try {
            const index = await contract.methods.getMyIndex().call({ from: accounts[0] });
            console.log(`recieved from smart contract ${index}`);
            if (index !== '0') {
                alert(
                    `You are already registered`,
                );
            }
            else {
                const submitted = await contract.methods.newApplicant(this.state.name, this.state.degreeIPFSHash, this.state.experienceLetterIPFSHash).send({ from: accounts[0] });

                if (submitted) {
                    this.props.history.push('/UserTableList');
                }
            }
        }
        catch (error) {
            // alert(
            //     `Failed Submit. Please check if you are using correct metamask account ${error.message}`,
            // );
            toast.error(`Failed Submit. Please check if you are using correct metamask account ${error.message}`, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }

    }

    render() {
        return (

            <div style={{ flexGrow: 1 }}>
                <ToastContainer />
                <AppBar position="fixed" style={{ height: '80px' }}>
                    <Typography variant="h6" color="inherit" style={{ padding: '20px', alignSelf: 'center' }} >
                        Pre-employment Verification
                                </Typography>
                    <Typography color="inherit" style={{ top: '25px', position: 'absolute', alignSelf: 'flex-end', fontSize: '15px', paddingRight: '25px' }} >
                        Hi {this.state.accounts && this.state.accounts.length !== 0 && this.state.accounts[0]}
                    </Typography>
                </AppBar>
                <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: '100vh', backgroundColor: "#F2F2F2" }}>
                    <Paper style={{ width: '50%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} elevation={1} >
                        <div style={{ padding: '40px', marginLeft: '50px' }}>
                            <TextField
                                label="Name"
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div style={{ padding: '30px', marginLeft: '50px', flexDirection: 'row' }}>
                            {
                                this.state.ipfsDegLoading ? (
                                    < BeatLoader
                                        sizeUnit={"px"}
                                        size={30}
                                        color={'red'}
                                        loading
                                    />
                                ) : (
                                        <ReactFileReader fileTypes={["image/*"]} base64={true} handleFiles={this.onDegreeupload}>
                                            < Button variant="contained"
                                                color="primary"
                                                className={
                                                    classes.uploadbutton
                                                }
                                                disabled={
                                                    this.state.degreeIPFSHash ? true : false
                                                } >
                                                Upload latest Degree Certificate
                                            <span className={classes.uploadicon} >
                                                    <CloudUploadIcon />
                                                </span>
                                            </Button>
                                        </ReactFileReader>
                                    )
                            }
                        </div>
                        <div style={{ padding: '30px', marginLeft: '50px', flexDirection: 'row' }}>
                            {
                                this.state.ipfsExpLoading ? (
                                    < BeatLoader
                                        sizeUnit={"px"}
                                        size={30}
                                        color={'red'}
                                        loading
                                    />
                                ) : (
                                        <ReactFileReader fileTypes={["image/*"]} base64={true} handleFiles={this.onExpUpload}>
                                            < Button variant="contained"
                                                color="primary"
                                                className={
                                                    classes.uploadbutton
                                                }
                                                disabled={
                                                    this.state.experienceLetterIPFSHash ? true : false
                                                } >
                                                Upload latest Employment Experience Certificate
                                            <span className={classes.uploadicon} >
                                                    <CloudUploadIcon />
                                                </span>
                                            </Button>
                                        </ReactFileReader>
                                    )
                            }
                        </div>
                    </Paper>
                    <Grid item sm={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={classes.buttonstyle}
                            onClick={this.onSubmitClick}
                            disabled={this.state.experienceLetterIPFSHash && this.state.degreeIPFSHash ? false : true}
                        >
                            Submit
                        </Button>
                    </Grid>
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
    },
    uploadbutton: {
        minWidth: 200,
    },
    uploadicon: {
        paddingLeft: 10,
        float: 'right'
    },
}
export default ApplicantAddition;