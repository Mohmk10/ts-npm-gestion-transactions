export const DateFormat = {
  
  formatDate: (date: Date | null | undefined): string => {
    if (!date) return "Date non définie";
    const jour = String(date.getDate()).padStart(2, "0");
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const annee = String(date.getFullYear()); // <- () corrigé
    return `${jour}/${mois}/${annee}`;
  },

  
  formatDateTime: (dateTime: Date | null | undefined): string => {
    if (!dateTime) return "Date et heure non définies";
    const jour = String(dateTime.getDate()).padStart(2, "0");
    const mois = String(dateTime.getMonth() + 1).padStart(2, "0");
    const annee = String(dateTime.getFullYear());
    const hr = String(dateTime.getHours()).padStart(2, "0");
    const min = String(dateTime.getMinutes()).padStart(2, "0");
    const sec = String(dateTime.getSeconds()).padStart(2, "0");
    return `${jour}/${mois}/${annee} ${hr}:${min}:${sec}`;
  },


  toSqlDate: (date: Date): string => {
    const y = String(date.getFullYear());
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },
};
