import express from "express";

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const query = `
      query getUserDetails($username: String!, $year: Int) {
        matchedUser(username: $username) {
          username

          profile {
            realName
            aboutMe
            userAvatar
            company
            school
            websites
            ranking
            reputation
            starRating
          }

          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }

            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }

          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }

          badges {
            id
            name
            shortName
            displayName
            icon
            creationDate
          }
        }

        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }

        recentAcSubmissionList(
          username: $username
          limit: 20
        ) {
          id
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/",
        Origin: "https://leetcode.com",
      },

      body: JSON.stringify({
        query,
        variables: {
          username,
          year: new Date().getFullYear(),
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "LeetCode request failed",
        error: result,
      });
    }

    if (result.errors) {
      return res.status(400).json({
        success: false,
        message: "LeetCode GraphQL error",
        errors: result.errors,
      });
    }

    if (!result.data?.matchedUser) {
      return res.status(404).json({
        success: false,
        message: `User '${username}' not found`,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("LeetCode API Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
