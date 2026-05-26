import "../css/Banner.css";
import bannerImg from "../assets/banner.png";

function Banner() {
  return (
    <div className="banner">

      <div className="banner-left">

      <h1>Fresh Food. Fast Delivery.</h1>

<p>
From snacks to beverages, everything
you love in one place.
</p>

      </div>



      <div className="banner-right">

        <img src={bannerImg} alt="" />

      </div>

    </div>
  );
}

export default Banner;