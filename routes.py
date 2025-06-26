import datetime
from flask import Blueprint, jsonify, request
from models import db, User, Project, Vote

routes = Blueprint('routes', __name__)

@routes.route('/api/projects')
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'projectid': project.projectid,
        "votes": project.votes,
        'title': project.title,
        'imageurl': project.imageurl or None,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'upvotes': project.upvotes,
        'downvotes': project.downvotes,
        'mehvotes': project.mehvotes,
        'score': str(project.score) if project.score is not None else None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'id': project.leader_user.employeeid,
            'name': project.leader_user.name
        } if project.leader_user else None,
        "favourites": project.favourites
    } for project in projects])

@routes.route('/api/votes', methods=['POST'])
def add_vote():
    data = request.get_json()

    employeeid = data.get('employeeid')
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

@routes.route('/api/projects/unvoted/<int:employeeid>', methods=['GET'])
def get_unvoted_projects(employeeid):
    subquery = db.session.query(Vote.projectid).filter_by(employeeid=employeeid)
    
    unvoted_projects = Project.query.filter(~Project.projectid.in_(subquery)).all()
    return jsonify([{
        'projectid': project.projectid,
        'title': project.title,
        'imageurl': project.imageurl or None,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'id': project.leader_user.employeeid,
            'name': project.leader_user.name
        } if project.leader_user else None
    } for project in unvoted_projects])

@routes.route("/api/projects/voted/<int:employeeid>", methods=["GET"])
def get_voted_projects(employeeid):
    subquery = db.session.query(Vote.projectid).filter_by(employeeid=employeeid)

    voted_projects = Project.query.filter(Project.projectid.in_(subquery)).all()
    return jsonify([{
        'projectid': project.projectid,
        "votes": project.votes,
        'title': project.title,
        'imageurl': project.imageurl or None,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'upvotes': project.upvotes,
        'downvotes': project.downvotes,
        'mehvotes': project.mehvotes,
        'score': str(project.score) if project.score is not None else None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'id': project.leader_user.employeeid,
            'name': project.leader_user.name
        } if project.leader_user else None,
        "favourites": project.favourites
    } for project in voted_projects])

@routes.route('/api/favourite/<int:employeeid>', methods=['GET'])
def get_favorite_project(employeeid):
    user = User.query.get(employeeid)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    favourite_project_id = user.favourite
    if not favourite_project_id:
        return jsonify({'message': 'No favourite project found'}), 404

    project = Project.query.get(favourite_project_id)
    if not project:
        return jsonify({'error': 'Favourite project not found'}), 404

    return jsonify({
        "projectid": project.projectid,
    }), 200
    