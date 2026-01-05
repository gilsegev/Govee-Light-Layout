import ConfigurationPanel from '../components/controls/ConfigurationPanel';
import SoffitCanvas from '../components/canvas/SoffitCanvas';

export default function Page() {
  return (
    <main className="flex h-screen w-full flex-col bg-background overflow-hidden">
      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        <ConfigurationPanel />
        <SoffitCanvas />
      </div>
    </main>
  );
}