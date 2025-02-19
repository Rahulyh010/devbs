import axios from "axios";
import { Request, Response } from "express";

const redirectUri =
  process.env.LINKEDIN_REDIRECT_URI ??
  "https://www.bskilling.com/reviews/write-a-review"; // Ensure this matches LinkedIn App settings

export const linkedInAuthCallback = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code } = req.query;
  console.log(code);
  if (!code) {
    return res.status(400).json({ error: "Code not provided" });
  }

  try {
    // Step 1: Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
      }
    );
    console.log(tokenResponse.data, "tokenResponse.data");
    const accessToken = tokenResponse.data.access_token;

    // Step 2: Fetch LinkedIn profile data
    const userResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(userResponse.data, "userResponse.data");

    // Step 3: Fetch Profile Picture
    // const pictureResponse = await axios.get(
    //   "https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))",
    //   {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   }
    // );

    // Extracting profile data
    // const userData = {
    //   id: userResponse.data.id,
    //   name: `${userResponse.data.localizedFirstName} ${userResponse.data.localizedLastName}`,
    //   image:
    //     pictureResponse.data.profilePicture["displayImage~"].elements[0]
    //       .identifiers[0].identifier,
    // };

    return res.json(userResponse.data);
  } catch (error) {
    console.error("Error fetching LinkedIn user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
