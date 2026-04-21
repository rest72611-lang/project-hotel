import { Link } from "react-router-dom";
import { authService } from "../../../Services/AuthService";
import "./Home.css";

function Home() {
    const user = authService.getUser();
    const isLoggedIn = !!user;
    const isAdmin = authService.isAdmin();

    return (
        <div className="Home">
            <section className="HomeHero">
                <div className="HeroContent">
                    <span className="HeroEyebrow">Vacation Management Platform</span>
                    <h1>Plan, manage, and explore vacations in one place.</h1>
                    <p>
                        Browse upcoming trips, track likes, manage vacation content as an admin,
                        and use the built-in AI tools for smarter travel discovery.
                    </p>

                    <div className="HeroActions">
                        {!isLoggedIn && <Link to="/login" className="PrimaryAction">Login</Link>}
                        {!isLoggedIn && <Link to="/register" className="SecondaryAction">Create Account</Link>}
                        {isLoggedIn && !isAdmin && <Link to="/vacations" className="PrimaryAction">Explore Vacations</Link>}
                        {isLoggedIn && isAdmin && <Link to="/admin/add-vacation" className="PrimaryAction">Open Admin Tools</Link>}
                        {isLoggedIn && !isAdmin && <Link to="/recommendation" className="SecondaryAction">Try AI Recommendation</Link>}
                    </div>
                </div>

                <div className="HeroPanel">
                    <div className="StatCard">
                        <strong>Smart Planning</strong>
                        <span>Find trips by interest, timing, and popularity.</span>
                    </div>
                    <div className="StatCard">
                        <strong>Admin Control</strong>
                        <span>Create, edit, and maintain vacation content with ease.</span>
                    </div>
                    <div className="StatCard">
                        <strong>Live Experience</strong>
                        <span>Likes, reports, AI tools, and Docker-ready deployment.</span>
                    </div>
                </div>
            </section>

            <section className="HomeHighlights">
                <article className="HighlightCard">
                    <h3>For Travelers</h3>
                    <p>
                        View vacations, like your favorites, filter active and future trips,
                        and get AI-based destination ideas.
                    </p>
                </article>

                <article className="HighlightCard">
                    <h3>For Admins</h3>
                    <p>
                        Manage vacations, upload images, update pricing and dates,
                        and review likes through the report screen.
                    </p>
                </article>

                <article className="HighlightCard">
                    <h3>Project Ready</h3>
                    <p>
                        Full-stack structure with authentication, role separation,
                        reporting, Postman support, and Docker deployment.
                    </p>
                </article>
            </section>
        </div>
    );
}

export default Home;
