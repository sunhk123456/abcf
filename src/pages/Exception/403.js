import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    desc={formatMessage({ id: 'app.exception.description.403' })}
    linkElement={Link}
    // backText={formatMessage({ id: 'app.exception.back' })}
    backText="返回登录"
    redirect="/login"
  />
);

export default Exception403;
