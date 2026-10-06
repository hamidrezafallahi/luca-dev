import React from 'react';

import { getTranslations } from 'next-intl/server';

import MediaImage from '@components/atoms/MediaImage';
import { Rate } from '@components/atoms/defaultElements/customRate';
import { IUser } from '@models/user';

export async function SupplierProfile({ ...props }: { user: IUser }) {
  const { user } = props;
  const t = await getTranslations();
  return (
    <div className="flex md:flex-row flex-col items-start md:items-center gap-6 md:gap-12 py-6 w-full text-start">
      <div className="relative flex-shrink-0 rounded-full w-28 md:w-40 h-28 md:h-40 overflow-hidden luca-ph">
        <MediaImage
          src={user.userImage}
          alt={user.fullName}
          height={320}
          width={320}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 items-start gap-2.5 min-w-0">
        <span className="luca-eyebrow">{t('common.supplier')}</span>
        <h1 className="luca-h1">{user.fullName}</h1>
        <div className="flex items-center gap-2">
          <Rate value={user.averageRate} />
          <span className="text-[13px] luca-muted">
            {t('common.votesCount', { count: user.rateCount })}
          </span>
        </div>
        {user.userDescription ? (
          <p className="max-w-[560px] leading-loose luca-muted">{user.userDescription}</p>
        ) : null}
      </div>
    </div>
  );
}
