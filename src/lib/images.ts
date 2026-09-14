/**
 * All imagery is sourced externally from Unsplash (free, commercial use).
 * Every ID below was verified live (HTTP 200 + visual check) on 2026-09-15.
 * Photos are always rendered through <Duotone/> which desaturates and
 * multiplies graphite over them so no photo can introduce a second accent.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export const IMG = {
  // Hero / aerial city
  aerialNight: u('1444723121867-7a241cacace9', 2000),
  aerialCity: u('1477959858617-67f85cf4f1df', 2000),
  aerialGolden: u('1480714378408-67cf0d13bc1b', 2000),
  // Valuations / skyline
  towersUp: u('1486406146926-c627a92ad1ab'),
  streetCanyon: u('1449824913935-59a10b8d2000'),
  modernHouse: u('1591474200742-8e512e6f98f8'),
  // Asset management
  blueprintDraft: u('1503387762-592deb58ef4e'),
  siteAerial: u('1541888946425-d81bb19240f5'),
  siteWorkers: u('1504307651254-35680f356dfd'),
  parking: u('1590674899484-d5640e854abe'),
  // Spatial / GIS
  worldMap: u('1524661135-423995f22d0b'),
  coastalAerial: u('1489516408517-0c0a15662682'),
  earthNetwork: u('1451187580459-43490279c0fa', 2000),
  // Data
  dashboardScreen: u('1526628953301-3e589a6a8b74'),
  serverRoom: u('1558494949-ef010cbdcc31'),
  // People / office
  office: u('1497366216548-37526070297c'),
  meeting: u('1517245386807-bb43f82c33c4'),
  teamTable: u('1600880292203-757bb62b4baf'),
  workspace: u('1519389950473-47ba0277781c'),
  deskTop: u('1520607162513-77705c0f0d4a'),
  officeBW: u('1553877522-43269d4ea984'),
  // Portraits
  p1: u('1531384441138-2736e62e0919', 900),
  p2: u('1573497019940-1c28c88b4f3e', 900),
  p3: u('1542178243-bc20204b769f', 900),
  p4: u('1567532939604-b6b5b0db2604', 900),
  p5: u('1507003211169-0a1dd7228f2d', 900),
  p6: u('1595152772835-219674b2a8a6', 900),
  p7: u('1548142813-c348350df52b', 900),
  p8: u('1560250097-0b93528c311a', 900),
  p9: u('1494790108377-be9c29b29330', 900),
};
