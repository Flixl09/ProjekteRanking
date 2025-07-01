export class ProjectDto {
  projectid?: number;              // DIE ID DES PROJEKTS
  leader!: UserDto;                 // Der Projektleiter
  title!: string;                 // Der Projekttitel
  description!: string;          // Die Projektbeschreibung
  projecturl?: string;          // Optionale Projekturl
  upvotes?: number;              // Upvotes des Projekts (+1)
  downvotes?: number;            // Downvotes des Projekts (-1)
  mehvotes?: number;             // Mehvotes des Projekts (+0)
  votes?: number;                // Allgemeine Voteanzahl
  score?: number;                // Score (up - down - meh * 0.1)
  createdat?: Date;              // Wann hinzugefügt
  authorized!: boolean;          // Ob Projekt zum Voten freigegeben ist
  color!: string;                // Projektfarbe (Hex)
  shortdesc!: string;            // Kurzbeschreibung (max 60 Zeichen)
  favourites?: number;           // Anzahl der Favoriten
}

export class UserDto {
  name!: string;                // Der Name des Mitarbeiters
  email?: string;               // Die E-Mail des Mitarbeiters
  authkey!: string;             // Der Authentifizierungsschlüssel des Mitarbeiters
  votes?: number;              // Die Anzahl der abgegebenen Votes des Mitarbeiters
  favoutire?: number;           // Die ID des Lieblingsprojekts des Mitarbeiters
  editor?: boolean;             // Ob der Mitarbeiter ein Editor ist
}

export class ImageDto {
  id!: number;             // Die ID des Bildes
  projectid!: number;           // Die ID des Projekts, zu dem das Bild gehört
  imageurl!: string;                 // Die URL des Bildes
}
