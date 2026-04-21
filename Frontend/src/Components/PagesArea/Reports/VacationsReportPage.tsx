import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "./VacationsReportPage.css";
import { ReportModel } from "../../../Models/report-model";
import { authService } from "../../../Services/AuthService";
import { reportService } from "../../../Services/report-service";

function VacationsReportPage() {
    // The report page is derived from the vacations dataset rather than a dedicated reporting endpoint.
    const [reportData, setReportData] = useState<ReportModel[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" />;
    }

    if (!authService.isAdmin()) {
        return <Navigate to="/vacations" />;
    }

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport(): Promise<void> {
        try {
            setLoading(true);
            setError("");

            const data = await reportService.getVacationsReport();
            setReportData(data);
        }
        catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    }

    function exportCsv(): void {
        try {
            // A UTF-8 BOM is prepended so Excel opens the CSV with the expected encoding.
            let csv = "\uFEFF";
            csv += "Destination,Likes\n";

            for (const item of reportData) {
                const destination = `"${item.destination.replace(/"/g, '""')}"`;
                const likesCount = item.likesCount ?? 0;

                csv += `${destination},${likesCount}\n`;
            }

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);

            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "Vacation Likes.csv";
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            window.URL.revokeObjectURL(url);
        }
        catch (err: any) {
            setError(err.message);
        }
    }

    if (loading) {
        return <div className="VacationsReportPage">Loading...</div>;
    }

    return (
        <div className="VacationsReportPage">
            <h1>Vacations Report</h1>

            {error && <div className="errorBox">{error}</div>}

            {!error && (
                <>
                    <button className="exportButton" onClick={exportCsv}>
                        Export Likes CSV
                    </button>

                    <div className="chartContainer">
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="destination" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="likesCount" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

export default VacationsReportPage;
