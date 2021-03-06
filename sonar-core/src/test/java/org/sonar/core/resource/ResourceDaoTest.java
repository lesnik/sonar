/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2008-2012 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.core.resource;

import org.hamcrest.core.Is;
import org.junit.Before;
import org.junit.Test;
import org.sonar.core.persistence.DaoTestCase;

import java.util.List;

import static org.hamcrest.core.IsNot.not;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;
import static org.junit.matchers.JUnitMatchers.hasItems;

public class ResourceDaoTest extends DaoTestCase {

  private ResourceDao dao;

  @Before
  public void createDao() {
    dao = new ResourceDao(getMyBatis());
  }

  @Test
  public void testDescendantProjectIdsAndSelf() {
    setupData("fixture");

    List<Long> ids = dao.getDescendantProjectIds(1L);

    assertThat(ids, hasItems(2L));
    assertThat(ids.size(), Is.is(1));
  }

  @Test
  public void testDescendantProjectIdsAndSelf_id_not_found() {
    setupData("fixture");

    List<Long> ids = dao.getDescendantProjectIds(33333L);

    assertThat(ids, not(nullValue()));
    assertThat(ids.size(), Is.is(0));
  }
}

