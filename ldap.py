def fetch_user_data(username, password):
    mock_ldap_data = {
        "fschmid": {
            "password": "root",
            "employeeid": "92041720210421",
            "name": "Felix Schmid",
            "email": "fschmid@student.tgm.ac.at",
        },
        "mprochazka": {
            "password": "root",
            "employeeid": "92041720210422",
            "name": "Marc Simon Prochazka",
            "email": "mprochazka@student.tgm.ac.at",
        },
        "test": {
            "password": "test",
            "employeeid": "6969",
            "name": "Ligma",
            "email": "ligma@student.tgm.ac.at"
        }
    }

    user_data = mock_ldap_data.get(username)
    if user_data and user_data["password"] == password:
        return {
            "employeeid": user_data["employeeid"],
            "name": user_data["name"],
            "email": user_data["email"]
        }
    return None
