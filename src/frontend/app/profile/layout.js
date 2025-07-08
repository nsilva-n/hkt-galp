// app/profile/layout.js
export default function ProfileLayout({ children }) {
  return (
    <section className="font-sans profile__container">
      {children}
    </section>
  );
}
