import NavBar from '../components/global/NavBar.tsx';
import construction from '../assets/under-construction.png';

export default function ConnectionsPage() {
    return (
        <div>
            <NavBar/>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10%"}}>
                <img src={construction} alt="Under construction" style={{ maxWidth: "150px" }} />
            </div>
            <div>
                <h1>This page is still under construction.</h1>
            </div>
        </div>
    );
}