import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import Header from "../../components/user/Header";
import errorImage from "@/assets/images/404.png";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  const navigate = useNavigate();
   const role = useSelector((state) => state.user?.user?.role);
   const handleGoHome = () => {
    if (role) {
      navigate(`/${role}/dashboard`);
    } else {
      navigate("/"); // fallback if not logged in
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional header */}
      {/* <Header /> */}

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">

          {/* Illustration */}
          <img
            src={errorImage}
            alt="Page not found"
            className="mx-auto w-64"
          />

          {/* Text */}
          <h1 className="text-2xl font-bold tracking-tight">
            Page not found
          </h1>

          <p className="text-muted-foreground">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>

            <Button onClick={handleGoHome}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
