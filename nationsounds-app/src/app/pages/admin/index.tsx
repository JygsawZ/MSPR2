// pages/admin/index.tsx
import { getSession } from "next-auth/react";

export async function getServerSideProps() {
  const session = await getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function AdminPage() {
  return (
    <div>
      <h1>Bienvenue sur l&apos;interface Admin</h1>
    </div>
  );
}
