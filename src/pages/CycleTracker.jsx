import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/form.css";

function CycleTracker() {

  const [date, setDate] = useState(new Date());

  return (
    <div className="form-container">

      <h2 className="mb-4">Cycle Tracker</h2>

      <div className="cycle-grid">

        <div className="form-card">

          <form>

            <div className="mb-3">
              <label className="form-label">Last Period Date</label>
              <input type="date" className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Cycle Length</label>
              <input
                type="number"
                className="form-control"
                placeholder="Example: 28"
              />
            </div>

            <button className="btn btn-success">
              Track Cycle
            </button>

          </form>

        </div>

        <div className="calendar-box">
          <Calendar onChange={setDate} value={date} />
        </div>

      </div>

    </div>
  );
}

export default CycleTracker;