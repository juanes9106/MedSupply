module.exports = (req, res) => {
    const { username, password } = req.body;

    const connection = new Connection(config);

    connection.on('connect', (err) => {
        if (err) {
            console.error('Connection failed', err);
            res.json({ success: false, message: 'Connection failed' });
            return;
        }

        const request = new Request(
            `SELECT * FROM Users WHERE email = '${username}' AND password = '${password}'`,
            (err, rowCount) => {
                if (err) {
                    console.error('Query failed', err);
                    res.json({ success: false, message: 'Query failed' });
                } else if (rowCount > 0) {
                    res.json({ success: true });
                } else {
                    res.json({ success: false, message: 'Invalid credentials' });
                }
                connection.close();
            }
        );

        connection.execSql(request);
    });

    connection.connect();
};
