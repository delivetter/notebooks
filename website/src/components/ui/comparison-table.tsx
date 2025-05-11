import { FaCheck, FaTimes } from "react-icons/fa";

type StatStatus = "positive" | "negative" | "neutral";

interface ComparisonStat {
  label: string;
  traditional: {
    value: string;
    details: string;
    status: StatStatus;
  };
  robot: {
    value: string;
    details: string;
    status: StatStatus;
  };
}

const comparisonData: ComparisonStat[] = [
  {
    label: "CO2 Emissions",
    traditional: {
      value: "High",
      details: "120-200 g/km",
      status: "negative",
    },
    robot: {
      value: "Zero",
      details: "0 g/km (direct)",
      status: "positive",
    },
  },
  {
    label: "Load Capacity",
    traditional: {
      value: "High",
      details: "800-1500 kg",
      status: "positive",
    },
    robot: {
      value: "Low",
      details: "5-20 kg",
      status: "negative",
    },
  },
  {
    label: "Operating Cost (per delivery)",
    traditional: {
      value: "High",
      details: "2.50€ - 4.00€",
      status: "negative",
    },
    robot: {
      value: "Reduced",
      details: "0.80€ - 1.50€",
      status: "positive",
    },
  },
  {
    label: "Average Delivery Time",
    traditional: {
      value: "Variable",
      details: "Affected by traffic",
      status: "neutral",
    },
    robot: {
      value: "Predictable",
      details: "Not affected by traffic",
      status: "positive",
    },
  },
  {
    label: "Accessibility to Restricted Areas",
    traditional: {
      value: "Limited",
      details: "Restrictions in pedestrian zones",
      status: "negative",
    },
    robot: {
      value: "High",
      details: "Access to pedestrian zones",
      status: "positive",
    },
  },
  {
    label: "Time Flexibility",
    traditional: {
      value: "Medium",
      details: "Limited by working hours",
      status: "neutral",
    },
    robot: {
      value: "High",
      details: "24/7 operation possible",
      status: "positive",
    },
  },
  {
    label: "Impact on Urban Congestion",
    traditional: {
      value: "Negative",
      details: "Contributes to congestion",
      status: "negative",
    },
    robot: {
      value: "Positive",
      details: "Does not affect traffic",
      status: "positive",
    },
  },
  {
    label: "Initial Investment",
    traditional: {
      value: "Medium",
      details: "Existing infrastructure",
      status: "neutral",
    },
    robot: {
      value: "High",
      details: "Technological development",
      status: "negative",
    },
  },
];

function getStatusClass(status: StatStatus) {
  switch (status) {
    case "positive":
      return "bg-green-100 text-green-800";
    case "negative":
      return "bg-red-100 text-red-800";
    case "neutral":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-4 px-6 text-left w-1/3">Factor</th>
            <th className="py-4 px-6 text-center">Traditional Vans</th>
            <th className="py-4 px-6 text-center">Autonomous Robots</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((stat, index) => (
            <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index === comparisonData.length - 1 ? "" : "border-b"}`}>
              <td className="py-4 px-6 font-medium">{stat.label}</td>
              <td className="py-4 px-6 text-center">
                <span className={`inline-block ${getStatusClass(stat.traditional.status)} px-2 py-1 rounded`}>
                  {stat.traditional.value}
                </span>
                <div className="text-sm text-gray-600 mt-1">{stat.traditional.details}</div>
              </td>
              <td className="py-4 px-6 text-center">
                <span className={`inline-block ${getStatusClass(stat.robot.status)} px-2 py-1 rounded`}>
                  {stat.robot.value}
                </span>
                <div className="text-sm text-gray-600 mt-1">{stat.robot.details}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface ScenarioProps {
  title: string;
  items: string[];
  color: string;
}

export function OptimalScenarios({ traditional, autonomous }: { traditional: ScenarioProps; autonomous: ScenarioProps }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-xl font-semibold mb-4 text-${traditional.color}`}>{traditional.title}</h2>
        <ul className="space-y-3">
          {traditional.items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className={`text-${traditional.color} mr-3 mt-1`}><FaCheck /></span>
              <p className="text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-xl font-semibold mb-4 text-${autonomous.color}`}>{autonomous.title}</h2>
        <ul className="space-y-3">
          {autonomous.items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className={`text-${autonomous.color} mr-3 mt-1`}><FaCheck /></span>
              <p className="text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
