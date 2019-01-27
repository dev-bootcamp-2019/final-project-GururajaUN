// import CipLandingView from '../containers/CipLandingView';
// import ApplicationformView from '../containers/ApplicationformView';
// import GovLandingPage from '../containers/GovLandingPage';
// import ApplicantDashboard from '../containers/ApplicantDashboardView';
// import GovDashboard from '../containers/GovDashboard';
// import GdpHomeView from '../containers/GdpHomeView';
// import RegistrationView from '../containers/RegistrationView';

// var indexRoutes =[
//     {path:"/gov-dash-view", name: "Dashboard", component: GovDashboard},
//     {path:"/applicant-dashboard", name: " ApplicantDashboard", component:ApplicantDashboard},
//     {path:"/gov-gdp-view", name: "Home", component: GdpHomeView},
//     {path:"/gov-app-view", name: "Home", component: GovLandingPage},
//     {path:"/application-form", name: "Home", component: ApplicationformView},
//     {path:"/reg", name: "registration", component: RegistrationView},
//     {path:"/", name: "Home", component: CipLandingView}
// ];

// export default indexRoutes;

import HomePage from '../HomePage';
import ApplicantAddition from '../ApplicantAddition';
import NewHireVerification from '../NewHireVerification';
import EmployerScreen from '../EmployerScreen';
import UserTableList from '../UserTableList';
import UniversityVerification from '../UniversityVerification';
import EmployerVerification from '../EmployerVerification';

var indexRoutes =[
    
    {path:"/EmployerVerification", name: "Employer Approval Screen", component: EmployerVerification},
        {path:"/UniversityVerification", name: "University Approval Screen", component: UniversityVerification},
        {path:"/UserTableList", name: "User Table Screen", component: UserTableList},
        {path:"/EmployerScreen", name: "Employer Screen", component: EmployerScreen},    
        {path:"/NewHireVerification", name: "New Hire Verification", component: NewHireVerification},
        {path:"/ApplicantAddition", name: "Applicant Dashboard", component: ApplicantAddition},
         {path:"/", name: "Home", component: HomePage}
    ];
export default indexRoutes;