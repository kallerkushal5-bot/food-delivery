export default function Banner({ title, subtitle, bgImage }) {
  return (
    <div className="page-banner" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}