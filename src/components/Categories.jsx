import { Link } from "react-router-dom"
import "./Categories.css"

function Categories() {

    return (

        <section id="categories" className="categories">

            <h2>Kategoriler</h2>

            <div className="categoryGrid">

                <Link to="/category/gpu" className="categoryCard">
                    
                    <span>Ekran Kartı</span>
                </Link>

                <Link to="/category/laptop" className="categoryCard">
                    
                    <span>Laptop</span>
                </Link>

                <Link to="/category/monitor" className="categoryCard">
                    
                    <span>Monitör</span>
                </Link>

                <Link to="/category/headset" className="categoryCard">
                    
                    <span>Kulaklık</span>
                </Link>

                <Link to="/category/mouse" className="categoryCard">
                    
                    <span>Mouse</span>
                </Link>

                <Link to="/category/keyboard" className="categoryCard">
                    
                    <span>Klavye</span>
                </Link>

                <Link to="/category/tv" className="categoryCard">
                    
                    <span>Televizyon</span>
                </Link>

            </div>

        </section>

    )

}

export default Categories