import Menu from '@/app/extension-side/menu';

const RightSide = () => {
  return (
    <div className="hidden md:block md:p-8 md:fixed md:right-0 md:h-full md:w-1/4 ">
      <Menu />
    </div>
  );
};

export default RightSide;
