import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  type Project = {
    id: Nat;
    title: Text;
    category: Text;
    description: ?Text;
    author: Text;
    stars: Nat;
  };

  stable var nextId: Nat = 0;
  let projects = HashMap.HashMap<Nat, Project>(10, Nat.equal, Nat.hash);

  public func addProject(title: Text, category: Text, description: ?Text, author: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let project: Project = {
      id;
      title;
      category;
      description;
      author;
      stars = 0;
    };
    projects.put(id, project);
    id
  };

  public query func getProjects() : async [Project] {
    Iter.toArray(projects.vals())
  };

  public func removeProject(id: Nat) : async Result.Result<(), Text> {
    switch (projects.remove(id)) {
      case null { #err("Project not found") };
      case (?_) { #ok(()) };
    }
  };

  public func starProject(id: Nat) : async Result.Result<(), Text> {
    switch (projects.get(id)) {
      case null { #err("Project not found") };
      case (?project) {
        let updatedProject = {
          id = project.id;
          title = project.title;
          category = project.category;
          description = project.description;
          author = project.author;
          stars = project.stars + 1;
        };
        projects.put(id, updatedProject);
        #ok(())
      };
    }
  };

  public func unstarProject(id: Nat) : async Result.Result<(), Text> {
    switch (projects.get(id)) {
      case null { #err("Project not found") };
      case (?project) {
        if (project.stars == 0) {
          return #err("Project has no stars");
        };
        let updatedProject = {
          id = project.id;
          title = project.title;
          category = project.category;
          description = project.description;
          author = project.author;
          stars = project.stars - 1;
        };
        projects.put(id, updatedProject);
        #ok(())
      };
    }
  };

  public query func getProjectsByCategory(category: Text) : async [Project] {
    let filteredProjects = Array.filter<Project>(Iter.toArray(projects.vals()), func (p: Project) : Bool {
      p.category == category
    });
    filteredProjects
  };
}
