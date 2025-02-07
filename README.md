# MVP-Guardian

MVP-Guardian is a security dashboard that aggregates and analyzes security-related information from various Web3 projects to help users stay informed and take necessary actions to protect their assets.

## Features

1. **Project Selection**: Users specify Web3 projects they want to monitor.
2. **Discord Announcements Extraction**: The system retrieves posts from official announcement channels of each project's Discord server.
3. **Twitter Data Aggregation**:
   - Searches for relevant tweets using [Cookie Data Swarm API](https://docs.cookie.fun/#/api/endpoints).
   - Monitors security-related Twitter accounts for important updates.
4. **AI-Powered Filtering**:
   - Aggregated data is analyzed using a generative AI model.
   - The AI determines the importance of each piece of information.
   - Important data is labeled and stored in the database.
5. **User Dashboard**:
   - Users log into the application.
   - The system retrieves a list of Web3 projects they have interacted with based on their transaction history.
   - Relevant security updates from the database are displayed to the user.

## Future Enhancements

- **Incident Detection**: AI will assess the severity of security-related news and highlight critical incidents in red.
- **Account Revocation**: If a high-risk incident is detected, users will be prompted to revoke access to their accounts.
- **Production Release**: Currently, only a demo version is available, but future updates will include full implementation.

## Installation & Usage
(Currently in demo phase, installation instructions will be updated once the full version is released.)

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss potential improvements.

## License
This project is licensed under the MIT License.

---

Stay safe and secure in the Web3 ecosystem with MVP-Guardian!

