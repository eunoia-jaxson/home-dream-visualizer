interface EncouragementMessage {
  message: string;
  color: string;
  icon: string;
}

interface ProgressBarProps {
  progress: number;
  encouragementMessage: EncouragementMessage;
}

const ProgressBar = ({ progress, encouragementMessage }: ProgressBarProps) => {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">입력 진행률</span>
        <span className="text-sm font-bold text-purple-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 격려 메시지 */}
      <div
        className={`text-center p-3 rounded-lg bg-gradient-to-r ${
          progress === 100
            ? 'from-green-50 to-blue-50 border border-green-200'
            : 'from-purple-50 to-pink-50 border border-purple-200'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">{encouragementMessage.icon}</span>
          <p className={`font-medium ${encouragementMessage.color}`}>
            {encouragementMessage.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
