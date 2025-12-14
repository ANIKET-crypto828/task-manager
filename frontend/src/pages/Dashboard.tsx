import React from 'react';
import { useAssignedTasks, useCreatedTasks, useOverdueTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskSkeleton } from '../components/tasks/TaskSkeleton';
import { useAuth } from '../hooks/useAuth';
import { ClipboardList, UserCheck, AlertCircle, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks: assignedTasks, isLoading: loadingAssigned } = useAssignedTasks();
  const { tasks: createdTasks, isLoading: loadingCreated } = useCreatedTasks();
  const { tasks: overdueTasks, isLoading: loadingOverdue } = useOverdueTasks();

  const StatCard = ({ title, count, icon: Icon, color }: any) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your tasks today</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned to Me"
          count={assignedTasks?.length || 0}
          icon={UserCheck}
          color="border-blue-500"
        />
        <StatCard
          title="Created by Me"
          count={createdTasks?.length || 0}
          icon={ClipboardList}
          color="border-green-500"
        />
        <StatCard
          title="Overdue Tasks"
          count={overdueTasks?.length || 0}
          icon={AlertCircle}
          color="border-red-500"
        />
        <StatCard
          title="Completion Rate"
          count={
            assignedTasks
              ? `${Math.round((assignedTasks.filter(t => t.status === 'COMPLETED').length / assignedTasks.length) * 100) || 0}%`
              : '0%'
          }
          icon={TrendingUp}
          color="border-purple-500"
        />
      </div>

      {/* Overdue Tasks Section */}
      {overdueTasks && overdueTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Overdue Tasks</h2>
          </div>
          {loadingOverdue ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <TaskSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overdueTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => {}} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Assigned Tasks Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks Assigned to Me</h2>
        {loadingAssigned ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : assignedTasks && assignedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedTasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tasks assigned to you yet</p>
          </div>
        )}
      </section>

      {/* Created Tasks Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks Created by Me</h2>
        {loadingCreated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : createdTasks && createdTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdTasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">You haven't created any tasks yet</p>
          </div>
        )}
      </section>
    </div>
  );
};