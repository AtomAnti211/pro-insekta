import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivities } from "../api/activity";
import { sendContactMessage } from "../api/contact";
import type { ContactMessagePayload } from "../types/contactMessage";
import type { Activity } from "../types/activity";
import "./LandingPage.css";

export default function LandingPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // CONTACT FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [activityId, setActivityId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // HTML TAGS STRIPPER FOR ACTIVITY DESCRIPTIONS
  const stripHtml = /<[^>]+>/g;


  useEffect(() => {
    getActivities()
      .then(data => {
        setActivities(data);
        setLoadingActivities(false);
      })
      .catch(err => {
        console.error("ACTIVITY FETCH ERROR:", err);
        setLoadingActivities(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ContactMessagePayload = {
      name,
      email,
      phone,
      address,
      activity: activityId,
      message,
    };

    try {
      await sendContactMessage(payload);
      alert("Üzenet elküldve!");

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setActivityId(null);
      setMessage("");
    } catch (err) {
      alert("Hiba történt az üzenet küldésekor.");
      console.error(err);
    }
  };

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>Kártevőirtás gyorsan és biztonságosan</h1>
        <p>Professzionális rovar- és rágcsálóirtás lakossági és üzleti ügyfeleknek.</p>

        <div className="hero-buttons">
          <a href="#contact" className="btn-primary">Kapcsolatfelvétel</a>
          <Link to="/admin" className="btn-admin">Admin</Link>
        </div>
      </section>

      {/* TEVÉKENYSÉGEK */}
      <section className="services">
        <h2>Tevékenységeink</h2>

        {loadingActivities && <p>Betöltés…</p>}
        {!loadingActivities && activities.length === 0 && (
          <p>Jelenleg nincsenek felvitt tevékenységek.</p>
        )}

        <div className="service-grid">
          {activities.map(act => (
            <Link
              key={act.id}
              to={`/activities/${act.id}`}
              className="service-card-link"
            >
              <div className="service-card">
                <img
                  src={act.activityURL}
                  alt={act.activityName}
                  className="service-image"
                />
                <h3>{act.activityName}</h3>

           
                <p>
                  {act.activityDescr.replace(stripHtml, "").length > 120
                  ? act.activityDescr.replace(stripHtml, "").slice(0, 120) + "..."
                  : act.activityDescr.replace(stripHtml, "")}
                </p>
   
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MIÉRT MINKET */}
      <section className="why-us">
        <h2>Miért válasszon minket?</h2>

        <ul>
          <li>✔ Több mint 20 év szakmai tapasztalat</li>
          <li>✔ Engedéllyel rendelkező szakemberek</li>
          <li>✔ Környezetbarát technológiák</li>
          <li>✔ Gyors kiszállás és garancia</li>
        </ul>
      </section>

      {/* KAPCSOLATFELVÉTEL */}
      <section className="contact" id="contact">
        <h2>Kapcsolatfelvétel</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Név"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Telefonszám"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Cím"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />

          <select
            value={activityId ?? ""}
            onChange={e => setActivityId(Number(e.target.value))}
            required
          >
            <option value="">Válasszon tevékenységet…</option>
            {activities.map(act => (
              <option key={act.id} value={act.id}>
                {act.activityName}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Üzenet"
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
          ></textarea>

          <button type="submit" className="btn-primary">Üzenet küldése</button>
        </form>
      </section>

      <footer className="footer">
        <p>© Insecta – Minden jog fenntartva.</p>
      </footer>

    </div>
  );
}
