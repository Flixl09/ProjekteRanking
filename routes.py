import datetime
from flask import Blueprint, jsonify, request
from models import Images, db, User, Project, Vote
from ldap import fetch_user_data
import secrets
from unidecode import unidecode

routes = Blueprint('routes', __name__)

@routes.route('/api/projects')
def get_projects():
    projects = Project.query.filter_by(authorized=True).all()
    return jsonify([{
        'projectid': project.projectid,
        'title': project.title,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'finishat': project.finishat.isoformat() if project.finishat else None,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'name': project.leader_user.name,
            'email': project.leader_user.email,
        } if project.leader_user else None
    } for project in projects])

@routes.route('/api/projects/<int:projectid>')
def get_project(projectid):
    project = Project.query.get(projectid)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    if not project.authorized:
        return jsonify({'error': 'Project is not authorized'}), 403
    
    return jsonify({
        'projectid': project.projectid,
        'title': project.title,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'finishat': project.finishat.isoformat() if project.finishat else None,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'name': project.leader_user.name,
            'email': project.leader_user.email,
        } if project.leader_user else None
    })

@routes.route("/api/projects/unauthorized")
def get_unauthorized_projects():
    data = request.get_json()
    employeeid = authkey_to_employeeid(data.get('authkey'))
    if not employeeid:
        return jsonify({'error': 'Invalid authkey'}), 401
    
    user = User.query.get(employeeid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not user.editor:
        return jsonify({'error': 'User is not authorized to view unauthorized projects'}), 403
    
    projects = Project.query.filter_by(authorized=False).all()
    return jsonify([{
        'projectid': project.projectid,
        'title': project.title,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'finishat': project.finishat.isoformat() if project.finishat else None,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'name': project.leader_user.name,
            'email': project.leader_user.email,
        } if project.leader_user else None
    } for project in projects])
    

@routes.route('/api/votes', methods=['POST'])
def add_vote():
    data = request.get_json()

    employeeid = authkey_to_employeeid(data.get('employeeid'))
    projectid = data.get('projectid')
    votetype = data.get('votetype')

    if not employeeid or not projectid or votetype is None:
        return jsonify({'error': 'employeeid and projectid and votetype required'}), 400

    user = User.query.get(employeeid)
    project = Project.query.get(projectid)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    if votetype not in [1, -1, 0, 2, -2]:
        return jsonify({'error': 'Invalid votetype'}), 400

    if votetype == 2:
        user.favourite = project.projectid
        db.session.commit()
        return jsonify({'message': 'Project favorited'}), 200
    
    if votetype == -2:
        if user.favourite == project.projectid:
            user.favourite = None
            db.session.commit()
            return jsonify({'message': 'Project unfavorited'}), 200
        else:
            return jsonify({'error': 'Project not favorited'}), 404
    existing_vote = Vote.query.get((employeeid, projectid))
    if existing_vote and existing_vote.votetype == votetype:
        return jsonify({'error': 'Vote already exists'}), 409
    elif existing_vote and existing_vote.votetype != votetype:
        # Update existing vote
        existing_vote.votetype = votetype
        db.session.commit()
        return jsonify({'message': 'Vote updated'}), 200

    new_vote = Vote(
        employeeid=employeeid,
        projectid=projectid,
        votetype=votetype,
    )

    db.session.add(new_vote)
    db.session.commit()

    return jsonify({'message': 'Vote recorded'}), 201

@routes.route('/api/projects/unvoted/<authkey>', methods=['GET'])
def get_unvoted_projects(authkey):
    subquery = db.session.query(Vote.projectid).filter_by(employeeid=authkey_to_employeeid(authkey))

    unvoted_projects = Project.query.filter(~Project.projectid.in_(subquery), Project.authorized == True).all()

    return jsonify([{
        'projectid': project.projectid,
        'title': project.title,
        'projecturl': project.projecturl or None,
        'description': project.description,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'finishat': project.finishat.isoformat() if project.finishat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'email': project.leader_user.email,
            'name': project.leader_user.name
        } if project.leader_user else None
    } for project in unvoted_projects])

@routes.route("/api/projects/voted/<authkey>", methods=["GET"])
def get_voted_projects(authkey):
    subquery = db.session.query(Vote.projectid).filter_by(employeeid=authkey_to_employeeid(authkey))

    voted_projects = Project.query.filter(Project.projectid.in_(subquery), Project.authorized == True).all()
    return jsonify([{
        'projectid': project.projectid,
        "votes": project.votes,
        'title': project.title,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'upvotes': project.upvotes,
        'downvotes': project.downvotes,
        'mehvotes': project.mehvotes,
        'score': str(project.score) if project.score is not None else None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'finishat': project.finishat.isoformat() if project.finishat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'email': project.leader_user.email,
            'name': project.leader_user.name
        } if project.leader_user else None,
        "favourites": project.favourites
    } for project in voted_projects])

@routes.route('/api/favourite/<authkey>', methods=['GET'])
def get_favorite_project(authkey):
    user = User.query.get(authkey_to_employeeid(authkey))
    if not user:
        return jsonify({'error': 'User not found'}), 404

    favourite_project_id = user.favourite
    if not favourite_project_id:
        return jsonify({'message': 'No favourite project found', "projectid": -1}), 200

    project = Project.query.get(favourite_project_id)
    if not project:
        return jsonify({'error': 'Favourite project not found'}), 404

    return jsonify({
        "projectid": project.projectid,
    }), 200
    
@routes.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()
    employeeid = authkey_to_employeeid(data.get('authkey'))
    project = data.get('project')

    if not project:
        return jsonify({'error': 'Project data is required'}), 400

    title = project.get('title')
    title = unidecode(title.strip())
    description = unidecode(project.get('description'))
    shortdesc = unidecode(project.get('shortdesc'))
    projecturl = project.get('projecturl', None)
    color = project.get('color', 'FFFFFF')
    authorized = False
    leaderid = employeeid
    images = data.get('images', [])

    if not title or not description or not leaderid:
        return jsonify({'error': 'Title, description, and leaderid are required'}), 400

    user = User.query.get(leaderid)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    new_project = Project(
        title=title,
        description=description,
        projecturl=projecturl,
        shortdesc=shortdesc,
        authorized=authorized,
        color=color,
        leader_user=user
    )

    if images:
        if isinstance(images, list) and len(images) > 0:
            for image_url in images:
                if image_url:
                    new_image = Images(imageurl=image_url, project=new_project)
                    db.session.add(new_image)

    db.session.add(new_project)
    db.session.commit()

    return jsonify({'message': 'Project created successfully', 'projectid': new_project.projectid}), 201

def authkey_to_employeeid(authkey):
    user = User.query.filter_by(authkey=str(authkey)).first()
    if user:
        return user.employeeid
    return None

def get_employee(employeeid):
    user = User.query.get(employeeid)
    if user:
        return {
            'name': user.name,
            'email': user.email,
            "editor": user.editor,
            "votes": Vote.query.filter_by(employeeid=user.employeeid).count(),
            'favourite': user.favourite,
            'authkey': user.authkey
        }
    return None

@routes.route("/api/user/validate", methods=["POST"])
def validate_authkey():
    data = request.get_json()
    authkey = data.get('authkey')

    if not authkey:
        return jsonify({'error': 'Authkey is required'}), 400

    employeeid = authkey_to_employeeid(authkey)
    if employeeid:
        return jsonify({
            "message": "Authkey is valid",
        }), 200
    else:
        return jsonify({'error': 'Invalid authkey'}), 401

def generate_authkey():
    return secrets.token_hex(32)

@routes.route("/api/user/login", methods=["POST"])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user_data = fetch_user_data(username, password)
    if not user_data:
        return jsonify({'error': 'Invalid username or password'}), 401
    
    user = User.query.filter_by(employeeid=user_data['employeeid']).first()
    if not user:
        user = User(
            employeeid=user_data['employeeid'],
            name=user_data['name'],
            email=user_data["email"],
            editor=False,
            authkey=generate_authkey()
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "authkey": user.authkey,
        }), 200

    else:
        user.authkey = generate_authkey()
        db.session.commit()
        return jsonify({
            "authkey": user.authkey,
        }), 200

@routes.route("/api/user/<authkey>", methods=["GET"])
def get_user(authkey):
    employeeid = authkey_to_employeeid(authkey)
    if not employeeid:
        return jsonify({'error': 'Invalid authkey'}), 401
    user = get_employee(employeeid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user.pop('authkey', None) 
    user.pop("employeeid", None)
    return jsonify(user), 200

@routes.route("/api/projects/images/<int:projectid>", methods=["GET"])
def get_project_images(projectid: int):
    project = Project.query.get(projectid)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if not project.authorized:
        return jsonify({'error': 'Project is not authorized'}), 403
    
    images = Images.query.filter_by(projectid=project.projectid).all()
    image_urls = [image.imageurl for image in images]
    
    return jsonify({
        'projectid': project.projectid,
        'images': image_urls
    }), 200

@routes.route("/api/user/vote/<int:projectid>", methods=["POST"])
def get_user_votes(projectid: int):
    data = request.get_json()
    authkey = data.get('authkey')
    employeeid = authkey_to_employeeid(authkey)
    if not employeeid:
        return jsonify({'error': 'Invalid authkey'}), 401
    
    user = User.query.get(employeeid)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    vote = Vote.query.filter_by(employeeid=employeeid, projectid=projectid).first()

    return jsonify(vote.votetype if vote else None), 200