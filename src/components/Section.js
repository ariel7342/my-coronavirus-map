import React, { useContext } from "react";
import PropTypes from "prop-types";
import "assets/stylesheets/application.scss";
import { TotalsContext } from "../pages/index";
import _ from "lodash";
import "odometer/themes/odometer-theme-default.css";
import { ScrollSyncPane } from "react-scroll-sync";
import loadable from "@loadable/component";
const Odometer = loadable(() => import("react-odometerjs"));

const Section = ({ place }) => {
  const { totals, countries } = useContext(TotalsContext) || {
    totals: {},
    countries: {}
  };

  if (typeof window === "undefined" || !window.document) {
    return <div />;
  }

  const dtf = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  let d = "...";

  const totalCases = !_.isEmpty(totals) ? +totals.cases : 0;
  const totalRecoveredCases = !_.isEmpty(totals) ? +totals.recovered : 0;

  let totalRecoveredPercentage = 0;
  totalRecoveredPercentage = totalRecoveredCases / totalCases;
  totalRecoveredPercentage = totalRecoveredPercentage.toFixed(2) * 100;
  if (!_.isEmpty(totals)) {
    const date = new Date(totals.updated);
    d = dtf.format(date);
  }

  const sortedCountries = _.sortBy(
    !_.isEmpty(countries) ? countries : [],
    country => country.cases
  ).reverse();

  const getSection = dir => {
    return dir === "right" ? (
      <section className="section section-right">
        <div className="box totals">
          <h3>Total recovered</h3>
          <div className="total-number">
            <Odometer
              value={totalRecoveredCases}
              duration={500}
              format="(,ddd)"
            />
          </div>
        </div>
        <ScrollSyncPane>
          <div className="box countries">
            <h3>Confirmed Recovered Cases by Country</h3>

            {!_.isEmpty(sortedCountries) &&
              sortedCountries.map(country => {
                if (country.country !== "World") {
                  return (
                    <React.Fragment key={country.country}>
                      <ul className="countries-item">
                        <li className="country-title">
                          {`${country.country} `}
                        </li>
                        <li className="country-cases">
                          <Odometer
                            value={country.recovered}
                            duration={500}
                            format="(,ddd)"
                          />
                        </li>
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
        </ScrollSyncPane>
        <div className="box last-update">
          <h3>Recovered Percentage</h3>
          <p>{`${totalRecoveredPercentage}%`}</p>
        </div>
      </section>
    ) : (
      <section className="section section-left">
        <div className="box totals">
          <h3>Total Confirmed</h3>
          <div className="total-number">
            <Odometer value={totalCases} duration={500} format="(,ddd)" />
          </div>
        </div>
        <ScrollSyncPane>
          <div className="box countries">
            <h3>Confirmed Sick Cases by Country</h3>

            {!_.isEmpty(sortedCountries) &&
              sortedCountries.map(country => {
                if (country.country !== "World") {
                  return (
                    <React.Fragment key={country.country}>
                      <ul className="countries-item">
                        <li className="country-title">{`${country.country} `}</li>
                        <li className="country-cases">
                          <Odometer
                            value={country.cases}
                            duration={500}
                            format="(,ddd)"
                          />
                        </li>
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
        </ScrollSyncPane>
        <div className="box last-update">
          <h3>Last Update</h3>
          <p>{!_.isEmpty(totals) ? `${d}` : "..."}</p>
        </div>
      </section>
    );
  };

  const renderSection = () => {
    return <>{place === "left" ? getSection("left") : getSection("right")}</>;
  };

  return renderSection();
};

Section.propTypes = {
  place: PropTypes.string
};

export default Section;
