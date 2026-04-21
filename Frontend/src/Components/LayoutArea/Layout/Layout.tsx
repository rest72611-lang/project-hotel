import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";

import "./Layout.css";

// Stable page shell: header and menu stay mounted while routed content changes in main.
function Layout() {
    return (
        <div className="Layout">
            <Header />
            <Menu />
            <main>
                <Routing />
            </main>
        </div>
    );
}

export default Layout;
