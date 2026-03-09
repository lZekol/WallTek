import "./Categories.css"
import { useNavigate } from "react-router-dom"

function Categories() {

    const navigate = useNavigate()

    const cats = [

        { name: "Laptop", img: "/images/gaminglaptop.png", link: "/category/laptop" },
        { name: "Ekran Kartı", img: "/images/rtx4070.png", link: "/category/gpu" },
        { name: "Kulaklık", img: "/images/headset.png", link: "/category/headset" },
        { name: "Mouse", img: "/images/logitech-g305.png", link: "/category/mouse" }

    ]

    return (

        <section className="categories">

            <h2>Kategoriler</h2>

            <div className="categoryGrid">

                {cats.map((cat, i) => (

                    <div key={i}
                        className="categoryCard"
                        onClick={() => navigate(cat.link)}
                    >

                        <img src={cat.img} />

                        <p>{cat.name}</p>

                    </div>

                ))}

            </div>

        </section>

    )

}

export default Categories