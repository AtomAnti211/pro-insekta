import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivities } from "../api/activity";
import { sendContactMessage } from "../api/contact";
import "./LandingPage.css";

type Activity = {
  id: number;
  activityName: string;
  activityDescr: string;
  activityURL: string;
};

export default function LandingPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // CONTACT FORM STATE-EK
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [activityId, setActivityId] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>Kártevőirtás gyorsan és biztonságosan</h1>
        <p>Professzionális rovar- és rágcsálóirtás lakossági és üzleti ügyfeleknek, több mint 20 év tapasztalattal.</p>
        <div className="hero-buttons">
          <a href="#contact" className="btn-primary">Kapcsolatfelvétel</a>
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
              to={`/activity/${act.id}`}
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
                  {act.activityDescr.length > 120
                    ? act.activityDescr.slice(0, 120) + "..."
                    : act.activityDescr}
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

        <form
          className="contact-form"
          onSubmit={async e => {
            e.preventDefault();

            const payload = {
              name,
              email,
              phone,
              activity: activityId,
              message,
            };

            try {
              await sendContactMessage(payload);
              alert("Üzenet elküldve!");

              setName("");
              setEmail("");
              setPhone("");
              setActivityId("");
              setMessage("");
            } catch (err) {
              alert("Hiba történt az üzenet küldésekor.");
              console.error(err);
            }
          }}
        >
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

          <select
            value={activityId}
            onChange={e => setActivityId(e.target.value)}
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
        <p>© 2026 Insecta – Minden jog fenntartva.</p>
      </footer>

    </div>
  );
}

