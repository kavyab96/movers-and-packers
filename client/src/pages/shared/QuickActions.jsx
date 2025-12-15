
import ActionCard from './ActionCard.jsx';

const QuickActions = ({ role }) => {
  return (
    <div className="mx-auto max-w-6xl mt-10 mb-15">

      <div className="pt-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {role === "user" && (
          <>
            <ActionCard
              title="Book a Service"
              link="/user/book-service"
            />
            <ActionCard
              title="Bookings Overview"
              link="/user/bookings"
            />
          </>
        )}

        {role === "provider" && (
          <ActionCard
            title="View Jobs"
            link="/provider/jobs"
          />
        )}

        {role === "admin" && (
          <ActionCard
            title="Manage Users"
            link="/admin/users"
          />
        )}
      </div>
    </div>
  );
};
export default QuickActions;
