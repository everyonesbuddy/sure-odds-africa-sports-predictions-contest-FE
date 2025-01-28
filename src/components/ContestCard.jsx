import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardContest.css";

const leagueOptions = [
  { value: "basketball_nba", label: "NBA 🏀" },
  { value: "americanfootball_nfl", label: "NFL 🏈" },
  { value: "americanfootball_ncaaf", label: "NCAA Football 🏈" },
  { value: "basketball_ncaab", label: "NCAA Basketball 🏀" },
  { value: "icehockey_nhl", label: "NHL 🏒" },
  { value: "soccer_epl", label: "EPL ⚽" },
  { value: "soccer_germany_bundesliga", label: "Bundesliga ⚽" },
  { value: "soccer_italy_serie_a", label: "Serie A ⚽" },
  { value: "soccer_spain_la_liga", label: "La Liga ⚽" },
  { value: "soccer_usa_mls", label: "MLS ⚽" },
];

const getLeagueLabel = (value) => {
  const league = leagueOptions.find((league) => league.value === value);
  return league ? league.label : value;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ContestCard = ({
  primaryImageUrl,
  contestName,
  price,
  contestLeague,
  contestFrequency,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contest/${contestName}`);
  };

  // const calculateDuration = (start, end) => {
  //   const currentDate = new Date();
  //   const startDate = new Date(start);
  //   const endDate = new Date(end);

  //   if (currentDate < startDate) {
  //     const durationInMilliseconds = startDate - currentDate;
  //     const durationInDays = Math.ceil(
  //       durationInMilliseconds / (1000 * 60 * 60 * 24)
  //     );
  //     return {
  //       duration: durationInDays,
  //       message: `Contest starts in ${durationInDays} days`,
  //       isBeforeStart: true,
  //     };
  //   } else {
  //     const durationInMilliseconds = endDate - currentDate;
  //     const durationInDays = Math.ceil(
  //       durationInMilliseconds / (1000 * 60 * 60 * 24)
  //     );
  //     return {
  //       duration: durationInDays,
  //       message: `Contest ends in ${durationInDays} days`,
  //       isBeforeStart: false,
  //     };
  //   }
  // };

  // const { message, isBeforeStart } = calculateDuration(
  //   contestStartDate,
  //   contestEndDate
  // );

  return (
    <div className="card" onClick={handleClick}>
      <img src={primaryImageUrl} alt={contestName} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{contestName} Contest</h2>
        <p className="card-price">Prize: {price}</p>
        {/* <p
          className={`card-contest-format ${
            isBeforeStart ? "before-start" : "before-end"
          }`}
        >
          {message}
        </p> */}
        <p>
          Duration: <span className="card-frequency">{contestFrequency} </span>
        </p>
        <div className="card-leagues">
          {contestLeague.map((league) => (
            <span
              key={league}
              className="league-card"
              style={{ backgroundColor: getRandomColor() }}
            >
              {getLeagueLabel(league)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
