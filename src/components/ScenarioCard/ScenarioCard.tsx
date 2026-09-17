import { Link } from "react-router-dom";

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  url: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
}

function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <article className="scenario-card">

      <div className="scenario-image">
        <img
          src={scenario.image}
          alt={scenario.title}
        />

        <span className="scenario-category">
          {scenario.category}
        </span>
      </div>

      <div className="scenario-content">

        <h2>{scenario.title}</h2>

        <p>
          {scenario.description}
        </p>

        <Link to="/escenario/1"
              className="scenario-button">
            Iniciar escenario
          </Link>
        {/*<a
          href={scenario.url}
          target="_blank"
          rel="noopener noreferrer"
          className="scenario-button"
        >
          Iniciar escenario
        </a>*/}

      </div>

    </article>
  );
}

export default ScenarioCard;