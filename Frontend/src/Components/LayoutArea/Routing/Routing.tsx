import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../PagesArea/Home/Home";
import Page404 from "../../PagesArea/Page404/Page404";
import Login from "../../PagesArea/Login/Login";
import Register from "../../PagesArea/Register/Register";
import Vacations from "../../PagesArea/Vacations/Vacations";
import AddVacation from "../../PagesArea/AddVacation/AddVacation";
import EditVacation from "../../PagesArea/EditVacation/EditVacation";
import Recommendation from "../../PagesArea/Recommendation/Recommendation";
import McpPage from "../../PagesArea/McpPage/McpPage";
import VacationsReportPage from "../../PagesArea/Reports/VacationsReportPage";



function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/admin/add-vacation" element={<AddVacation />} />
            <Route path="/admin/edit-vacation/:vacationId" element={<EditVacation />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="*" element={<Page404 />} />
            <Route path="/mcp" element={<McpPage />} />
            <Route path="/admin/vacations-report" element={<VacationsReportPage />} />
            
        </Routes>
    );
}

export default Routing;
