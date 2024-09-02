import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import moment from "moment";
import Countdown from "react-countdown";

// const stripeApiKey = process.env.REACT_APP_STRIPE_API_KEY;

// Countdown renderer component
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span style={{ color: "red" }}>The tournament has ended!</span>;
  } else {
    return (
      <span style={{ color: "red" }}>
        {days} days {hours} hours {minutes} minutes {seconds} seconds
      </span>
    );
  }
};

const Leaderboard = () => {
  const [betsData, setBetsData] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [filter, setFilter] = useState("all");
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // const [balance, setBalance] = useState(null);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 600);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://sheet.best/api/sheets/b9c7054b-1a70-4afb-9a14-c49967e8faf8"
      );
      setBetsData(response.data);
      setFilteredBets(response.data); // Initial filter setup
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("https://api.stripe.com/v1/balance", {
  //         headers: {
  //           Authorization: `Bearer ${stripeApiKey}`,
  //         },
  //       });
  //       setBalance(response.data);
  //     } catch (error) {
  //       console.error("Error fetching balance:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const now = moment();
    const filtered = betsData.filter((bet) => {
      const postedTime = moment(bet?.postedTime);
      switch (filter) {
        case "day":
          return now.diff(postedTime, "days") < 1;
        case "week":
          return now.diff(postedTime, "weeks") < 1;
        case "month":
          return now.diff(postedTime, "months") < 1;
        case "all":
        default:
          return true;
      }
    });
    setFilteredBets(filtered);
  }, [filter, betsData]);

  // const formatAmount = (amount) => {
  //   return (amount / 100).toFixed(2);
  // };

  // const getTotalBalance = () => {
  //   if (!balance) return "Loading...";
  //   const availableAmount = balance.available.reduce(
  //     (acc, item) => acc + item.amount,
  //     0
  //   );
  //   const pendingAmount = balance.pending.reduce(
  //     (acc, item) => acc + item.amount,
  //     0
  //   );
  //   const totalAmount = availableAmount + pendingAmount;
  //   return formatAmount(totalAmount);
  // };

  const aggregateBets = (bets) => {
    const handicappers = {};

    bets.forEach((bet) => {
      if (bet.betResult === null) return;

      const odds = parseInt(bet.odds, 10);
      const username = bet.twitterUsername || "Anonymous";
      if (!handicappers[username]) {
        handicappers[username] = {
          totalOdds: 0,
          totalWonOdds: 0,
          numberOfBets: 0,
          numberOfBetsWon: 0,
          potentialWins: 0,
          socialType: bet.socialType,
        };
      }
      handicappers[username].totalOdds += odds;
      handicappers[username].numberOfBets += 1;
      if (bet.betResult === "won") {
        handicappers[username].totalWonOdds += odds;
        handicappers[username].numberOfBetsWon += 1;
        // Adjust calculation based on the sign of the odds
        if (odds > 0) {
          handicappers[username].potentialWins += 100 * (odds / 100); // For positive odds
        } else {
          handicappers[username].potentialWins += 100 * (100 / Math.abs(odds)); // For negative odds
        }
      }
    });

    return Object.entries(handicappers)
      .map(
        ([
          username,
          {
            totalOdds,
            totalWonOdds,
            numberOfBets,
            numberOfBetsWon,
            potentialWins,
            socialType,
          },
        ]) => ({
          username,
          totalOdds,
          totalWonOdds,
          numberOfBets,
          numberOfBetsWon,
          winRatio: (numberOfBetsWon / numberOfBets) * 100, // Calculate win ratio as a percentage
          potentialWins,
          socialType,
        })
      )
      .sort((a, b) => b.potentialWins - a.potentialWins); // Sort by potentialWins
  };

  // Calculate the end time of the tournament for week
  // const getTournamentEndTime = () => {
  //   const now = moment().utcOffset(-4); // EST is UTC-4
  //   const dayOfWeek = now.day();
  //   const daysUntilSunday = (7 - dayOfWeek) % 7; // Days until the next Sunday
  //   const nextSunday = now
  //     .clone()
  //     .add(daysUntilSunday, "days")
  //     .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
  //   return nextSunday.toDate();
  // };

  // Calculate the end time of the tournament for month
  const getTournamentEndTime = () => {
    const now = moment().utcOffset(-4); // EST is UTC-4
    const endOfMonth = now
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
    return endOfMonth.toDate();
  };

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">Countdown to Tournament End:</Typography>
        <Countdown date={getTournamentEndTime()} renderer={CountdownRenderer} />
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: "gray",
            mb: 3,
            borderRadius: 1,
          }}
        >
          Win 1,000,000 Naira (or $500 USD){" "}
          {/* <Link
            href="https://doinksports.com/?via=sureOdds"
            target="_blank"
            rel="noopener"
          >
            Doink Sports
          </Link>{" "} */}
          for first place.
        </Typography>
      </Box>

      {/* <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">Current Week Prize Pool:</Typography>
        <Typography variant="h4">${getTotalBalance()}</Typography>
      </Box> */}

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
          {["all", "day", "week", "month"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "contained" : "outlined"}
              onClick={() => setFilter(f)}
              sx={{
                minWidth: isMobile ? "50px" : "150px", // Make buttons smaller on mobile
                fontWeight: "bold", // Make text bolder
                fontSize: isMobile ? "12px" : "inherit", // Smaller text on mobile
                color: filter === f ? "#fff" : "#4F46E5", // Text color
                borderColor: "#4F46E5", // Border color
                backgroundColor: filter === f ? "#4F46E5" : "transparent", // Background color for selected button
                "&:hover": {
                  backgroundColor:
                    filter === f ? "#4F46E5" : "rgba(79, 70, 229, 0.1)", // Hover effect
                  borderColor: "#4F46E5",
                },
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: isMobile ? "12px" : "inherit" }}>
                  Partcipants (X or Reddit profile)
                </TableCell>
                {!isMobile && <TableCell>Total Won Odds</TableCell>}
                {!isMobile && <TableCell>Total Won %</TableCell>}
                <TableCell sx={{ fontSize: isMobile ? "12px" : "inherit" }}>
                  Potential Wins
                </TableCell>
                {/* {!isMobile && <TableCell>Donate to Handicapper</TableCell>} */}
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregateBets(filteredBets).map((handicapper, index) => (
                <TableRow key={handicapper.username}>
                  <TableCell>
                    {index + 1}.{" "}
                    <Avatar
                      src={`https://avatar.iran.liara.run/username?username=${handicapper.username}`}
                      alt={"Avatar"}
                      sx={{
                        width: isMobile ? 15 : 24,
                        height: isMobile ? 15 : 24,
                        display: "inline-flex",
                        verticalAlign: "middle",
                        marginRight: 1,
                      }}
                    />
                    <a
                      href={
                        handicapper.socialType === "twitter"
                          ? `https://x.com/${handicapper.username}`
                          : `https://www.reddit.com/user/${handicapper.username}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: isMobile ? "10px" : "inherit" }}
                    >
                      {handicapper.username}
                    </a>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      {handicapper.totalWonOdds}
                      <Tooltip title="Total amount of odds for bets that were won">
                        <IconButton size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      ({handicapper.numberOfBetsWon} /{" "}
                      {handicapper.numberOfBets}){" "}
                      {handicapper.winRatio.toFixed(2)}%
                      <Tooltip title="Percentage of bets won out of total bets made">
                        <IconButton size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: isMobile ? "10px" : "inherit" }}>
                    ${handicapper.potentialWins.toFixed(2)}
                    <Tooltip title="Potential earnings based on a $100 bet for each winning bet, adjusted for the odds">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  {/* {!isMobile && (
                    <TableCell>
                      <a
                        href="https://ko-fi.com/S6S710USRI"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          height="36"
                          style={{ border: "0px", height: "36px" }}
                          src="https://storage.ko-fi.com/cdn/kofi5.png?v=3"
                          border="0"
                          alt="Buy Me a Coffee at ko-fi.com"
                        />
                      </a>
                    </TableCell>
                  )} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Leaderboard;
