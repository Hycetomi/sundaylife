import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { CATEGORY_CONFIG, CATEGORIES } from './config';
import type { BlogCategory, BlogPost } from '@/types';

interface Props {
  active: BlogCategory | 'All';
  posts: BlogPost[];
}

const CategorySidebar = ({ active, posts }: Props) => {
  const navigate = useNavigate();

  const countFor = (cat: BlogCategory) => posts.filter(p => p.category === cat).length;

  const go = (cat: BlogCategory | 'All') => {
    navigate(cat === 'All' ? '/blog-pulse' : `/blog-pulse?category=${cat}`);
  };

  const items: {
    id: BlogCategory | 'All';
    label: string;
    count: number;
    Icon: React.ElementType;
    onWhiteText: string;
    onWhiteBg: string;
  }[] = [
    {
      id: 'All',
      label: 'All Posts',
      count: posts.length,
      Icon: LayoutGrid,
      onWhiteText: 'text-bitter-liquorice',
      onWhiteBg: 'bg-bitter-liquorice/8',
    },
    ...CATEGORIES.map(cat => ({
      id: cat,
      label: cat,
      count: countFor(cat),
      Icon: CATEGORY_CONFIG[cat].Icon,
      onWhiteText: CATEGORY_CONFIG[cat].onWhiteText,
      onWhiteBg: CATEGORY_CONFIG[cat].onWhiteBg,
    })),
  ];

  return (
    <aside className="w-52 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-0.5">
        <p className="font-cabinet font-bold text-[10px] uppercase tracking-[0.18em] text-bitter-liquorice/30 px-3 mb-4">
          Browse by
        </p>
        {items.map(({ id, label, count, Icon, onWhiteText, onWhiteBg }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? `${onWhiteBg} border-l-[3px] border-current ${onWhiteText} font-medium`
                  : 'text-bitter-liquorice/50 hover:text-bitter-liquorice hover:bg-bitter-liquorice/4 border-l-[3px] border-transparent'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="font-general text-sm flex-1 text-left">{label}</span>
              <span className={`font-cabinet font-bold text-[11px] px-1.5 py-0.5 rounded-md ${
                isActive
                  ? 'bg-current/10 text-current'
                  : 'bg-bitter-liquorice/6 text-bitter-liquorice/35'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
