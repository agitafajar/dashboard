import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}