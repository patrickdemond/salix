<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace salix\service\apex_host;
use cenozo\lib, cenozo\log, salix\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /** 
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    // add the total number of apex_scans
    if( $select->has_column( 'apex_scan_count' ) )
    {
      // to accomplish this we need to create two sub-joins, so start by creating the inner join
      $inner_join_sel = lib::create( 'database\select' );
      $inner_join_sel->from( 'apex_deployment' );
      $inner_join_sel->add_column( 'apex_host_id' );
      $inner_join_sel->add_column( 'COUNT(*)', 'apex_scan_count', false );

      $inner_join_mod = lib::create( 'database\modifier' );
      $inner_join_mod->group( 'apex_host_id' );
      $inner_join_mod->where( 'apex_host_id', '!=', NULL );

      // now create the outer join
      $apex_scan_outer_join_sel = lib::create( 'database\select' );
      $apex_scan_outer_join_sel->from( 'apex_host' );
      $apex_scan_outer_join_sel->add_column( 'id', 'apex_host_id' );
      $apex_scan_outer_join_sel->add_column(
        'IF( apex_host_id IS NOT NULL, apex_scan_count, 0 )', 'apex_scan_count', false );

      $apex_scan_outer_join_mod = lib::create( 'database\modifier' );
      $apex_scan_outer_join_mod->left_join(
        sprintf( '( %s %s ) AS inner_join', $inner_join_sel->get_sql(), $inner_join_mod->get_sql() ),
        'apex_host.id',
        'inner_join.apex_host_id' );

      // now join to our main modifier
      $modifier->left_join(
        sprintf(
          '( %s %s ) AS apex_scan_outer_join',
          $apex_scan_outer_join_sel->get_sql(),
          $apex_scan_outer_join_mod->get_sql()
        ),
        'apex_host.id',
        'apex_scan_outer_join.apex_host_id' );
      $select->add_column( 'apex_scan_count', 'apex_scan_count', false );
    }   

    // add the total number of participants
    if( $select->has_column( 'participant_count' ) )
    {
      // to accomplish this we need to create two sub-joins, so start by creating the inner join
      $inner_join_sel = lib::create( 'database\select' );
      $inner_join_sel->from( 'apex_baseline' );
      $inner_join_sel->add_table_column( 'apex_deployment', 'apex_host_id' );
      $inner_join_sel->add_column( 'COUNT( DISTINCT apex_baseline.participant_id )', 'participant_count', false );

      $inner_join_mod = lib::create( 'database\modifier' );
      $inner_join_mod->join( 'apex_exam', 'apex_baseline.id', 'apex_exam.apex_baseline_id' );
      $inner_join_mod->join( 'apex_scan', 'apex_exam.id', 'apex_scan.apex_exam_id' );
      $inner_join_mod->join( 'apex_deployment', 'apex_scan.id', 'apex_deployment.apex_scan_id' );
      $inner_join_mod->group( 'apex_host_id' );
      $inner_join_mod->where( 'apex_host_id', '!=', NULL );

      // now create the outer join
      $participant_outer_join_sel = lib::create( 'database\select' );
      $participant_outer_join_sel->from( 'apex_host' );
      $participant_outer_join_sel->add_column( 'id', 'apex_host_id' );
      $participant_outer_join_sel->add_column(
        'IF( apex_host_id IS NOT NULL, participant_count, 0 )', 'participant_count', false );

      $participant_outer_join_mod = lib::create( 'database\modifier' );
      $participant_outer_join_mod->left_join(
        sprintf( '( %s %s ) AS inner_join', $inner_join_sel->get_sql(), $inner_join_mod->get_sql() ),
        'apex_host.id',
        'inner_join.apex_host_id' );

      // now join to our main modifier
      $modifier->left_join(
        sprintf(
          '( %s %s ) AS participant_outer_join',
          $participant_outer_join_sel->get_sql(),
          $participant_outer_join_mod->get_sql()
        ),
        'apex_host.id',
        'participant_outer_join.apex_host_id' );
      $select->add_column( 'participant_count', 'participant_count', false );
    }   

    // add the list of allocations
    if( $select->has_column( 'allocations' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'allocation' );
      $join_sel->add_column( 'apex_host_id' );
      $join_sel->add_column(
        'GROUP_CONCAT( CONCAT_WS( " ", side, type ) ORDER BY type, side SEPARATOR ", " )',
        'allocations',
        false
      );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'scan_type', 'allocation.scan_type_id', 'scan_type.id' );
      $join_mod->group( 'apex_host_id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS apex_host_join_allocation', $join_sel->get_sql(), $join_mod->get_sql() ),
        'apex_host.id',
        'apex_host_join_allocation.apex_host_id' );
      $select->add_column( 'apex_host_join_allocation.allocations', 'allocations', false );
    }
  }
}
