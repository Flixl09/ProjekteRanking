export class ProjectDto {
  projectid!: number;              // DIE ID DES PROJEKTS
  leader!: number;                 // Der Projektleiter
  imageurl!: string;              // Das Projektbild
  title!: string;                 // Der Projekttitel
  description!: string;          // Die Projektbeschreibung
  projecturl?: string;          // Optionale Projekturl
  upvotes!: number;              // Upvotes des Projekts (+1)
  downvotes!: number;            // Downvotes des Projekts (-1)
  mehvotes!: number;             // Mehvotes des Projekts (+0)
  votes!: number;                // Allgemeine Voteanzahl
  score!: number;                // Score (up - down - meh)
  createdat!: Date;              // Wann hinzugefügt
  authorized!: boolean;          // Ob Projekt zum Voten freigegeben ist
  color!: string;                // Projektfarbe (Hex)
  shortdesc!: string;            // Kurzbeschreibung (max 60 Zeichen)
  favourites!: number;           // Anzahl der Favoriten
}
