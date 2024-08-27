import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Project {
  'id' : bigint,
  'title' : string,
  'description' : [] | [string],
  'author' : string,
  'stars' : bigint,
  'category' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addProject' : ActorMethod<[string, string, [] | [string], string], bigint>,
  'getProjects' : ActorMethod<[], Array<Project>>,
  'getProjectsByCategory' : ActorMethod<[string], Array<Project>>,
  'removeProject' : ActorMethod<[bigint], Result>,
  'starProject' : ActorMethod<[bigint], Result>,
  'unstarProject' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
